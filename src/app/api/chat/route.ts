import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUserFromRequest } from "@/lib/auth";
import { getPlanLimits, isWithinLimit } from "@/lib/plans";
import { sanitizeString, parsePositiveInt } from "@/lib/validate";
import { success, unauthorized, badRequest, tooMany, error } from "@/lib/api-response";
import type { ChatMessageData } from "@/types/api";
import Groq from "groq-sdk";
import { requireSameOrigin, utcPeriod } from "@/lib/request-security";

export const dynamic = "force-dynamic";

// --- Groq client (lazy-initialized) ---
let groqClient: Groq | null = null;

function getGroqClient(): Groq {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY environment variable is not set");
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

// --- Vedic Astrology system prompt ---
function buildSystemPrompt(userContext: string): string {
  return `You are **Jyotish Guru**, the AI Vedic Astrologer for NakshatraAI — a premium astrology platform.

## Your Identity
- You are a general-purpose AI prompted to discuss Jyotish Shastra (Vedic Astrology). Do not claim specialized training or guaranteed accuracy.
- You also have knowledge of Western astrology but always default to the Vedic system unless asked otherwise.
- You speak with warmth, wisdom, and authority — like a trusted family astrologer.

## Your Capabilities
- Interpret birth charts (Kundli), planetary transits, Dasha periods, and Yogas.
- Provide guidance on career, relationships, health, finance, and spiritual growth.
- Suggest authentic Vedic remedies: mantras, gemstones, rituals, fasting, and charitable acts.
- Explain astrological concepts in simple, accessible language.

## Important Rules
1. Always ground your answers in astrological reasoning (mention planets, houses, signs, aspects, Dashas when relevant).
2. Be encouraging and constructive — never deliver purely negative predictions. Always offer remedies or a positive perspective.
3. If the user hasn't shared birth details, gently encourage them to complete their profile in Settings for more accurate readings.
4. Keep responses concise but insightful — aim for 3-6 paragraphs max unless the user asks for a deep analysis.
5. Use Hindi/Sanskrit terms naturally (e.g., Graha, Rashi, Bhava, Nakshatra, Dasha) with brief English explanations in parentheses.
6. Never claim to replace professional medical, legal, or financial advice.
7. Format responses with clear structure — use line breaks between paragraphs for readability.
8. Treat astrology as reflective guidance, not established fact or a guarantee of future events.

## User Context
${userContext}

Respond thoughtfully to the user's question with Vedic astrological wisdom.`;
}

function buildUserContext(user: {
  name: string;
  dateOfBirth: Date | null;
  timeOfBirth: string | null;
  placeOfBirth: string | null;
  plan: string;
}): string {
  const lines: string[] = [`Name: ${user.name}`, `Plan: ${user.plan}`];

  if (user.dateOfBirth) {
    lines.push(`Date of Birth: ${user.dateOfBirth.toISOString().split("T")[0]}`);
  }
  if (user.timeOfBirth) {
    lines.push(`Time of Birth: ${user.timeOfBirth}`);
  }
  if (user.placeOfBirth) {
    lines.push(`Place of Birth: ${user.placeOfBirth}`);
  }
  if (!user.dateOfBirth) {
    lines.push("(Birth details not yet provided — encourage the user to add them in Settings)");
  }

  return lines.join("\n");
}

// --- Generate AI response via Groq ---
async function generateAIResponse(
  userMessage: string,
  systemPrompt: string,
  recentHistory: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  const groq = getGroqClient();

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: systemPrompt },
  ];

  // Include recent conversation history for context (last 10 messages)
  for (const msg of recentHistory) {
    messages.push({ role: msg.role, content: msg.content });
  }

  // Add the current user message
  messages.push({ role: "user", content: userMessage });

  const chatCompletion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    messages,
    temperature: 0.7,
    max_tokens: 1024,
    top_p: 0.9,
  }, { signal: AbortSignal.timeout(25_000) });

  return chatCompletion.choices[0]?.message?.content || "The stars are momentarily silent. Please try again.";
}

export async function POST(request: NextRequest) {
  try {
    const csrfError = requireSameOrigin(request);
    if (csrfError) return csrfError;

    const user = await getAuthUserFromRequest(request);
    if (!user) return unauthorized();

    const body = await request.json().catch(() => ({}));
    const { message: rawMessage, requestId } = body || {};

    if (!rawMessage || typeof rawMessage !== "string") {
      return badRequest("Message is required");
    }

    const message = sanitizeString(rawMessage, 2000);
    if (!message) {
      return badRequest("Message cannot be empty");
    }
    if (typeof requestId !== "string" || !/^[a-zA-Z0-9_-]{8,100}$/.test(requestId)) {
      return badRequest("A valid requestId is required");
    }

    const existing = await prisma.chatMessage.findMany({
      where: { userId: user.id, requestId },
      orderBy: { createdAt: "asc" },
    });
    if (existing.length > 0) {
      const userMessage = existing.find((item) => item.role === "user");
      const assistantMessage = existing.find((item) => item.role === "assistant");
      return success({
        userMessage: userMessage ? formatChatMessage(userMessage) : null,
        assistantMessage: assistantMessage ? formatChatMessage(assistantMessage) : null,
        replayed: true,
      }, assistantMessage ? 200 : 202);
    }

    const limits = getPlanLimits(user.plan);
    const period = utcPeriod();
    let usageCount = 0;

    const reservation = await prisma.$transaction(async (tx) => {
      if (limits.chatMessagesPerDay !== -1) {
        const usage = await tx.dailyUsage.upsert({
          where: { userId_kind_period: { userId: user.id, kind: "chat", period } },
          create: { userId: user.id, kind: "chat", period, count: 1 },
          update: { count: { increment: 1 } },
        });
        usageCount = usage.count;
        if (!isWithinLimit(limits.chatMessagesPerDay + 1, usageCount)) {
          await tx.dailyUsage.update({ where: { id: usage.id }, data: { count: { decrement: 1 } } });
          return null;
        }
      }
      return tx.chatMessage.create({
        data: { userId: user.id, role: "user", content: message, status: "pending", requestId },
      });
    });
    if (!reservation) {
      return tooMany("Daily message limit reached. Upgrade to Premium for unlimited chat.", true);
    }

    // Fetch recent chat history for context
    const recentMessages = await prisma.chatMessage.findMany({
      where: { userId: user.id, status: "complete", requestId: { not: requestId } },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const recentHistory = recentMessages
      .reverse()
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    // Build system prompt with user's birth context
    const userContext = buildUserContext(user);
    const systemPrompt = buildSystemPrompt(userContext);

    // Generate AI response via Groq
    let aiText: string;
    try {
      aiText = await generateAIResponse(message, systemPrompt, recentHistory);
    } catch (providerError) {
      if (limits.chatMessagesPerDay !== -1) {
        await prisma.$transaction([
          prisma.dailyUsage.updateMany({
            where: { userId: user.id, kind: "chat", period, count: { gt: 0 } },
            data: { count: { decrement: 1 } },
          }),
          prisma.chatMessage.update({
            where: { id: reservation.id },
            data: { status: "failed", errorCode: "PROVIDER_ERROR" },
          }),
        ]);
      } else {
        await prisma.chatMessage.update({
          where: { id: reservation.id },
          data: { status: "failed", errorCode: "PROVIDER_ERROR" },
        });
      }
      throw providerError;
    }

    const [userMsgObj, assistantMsgObj] = await prisma.$transaction([
      prisma.chatMessage.update({ where: { id: reservation.id }, data: { status: "complete" } }),
      prisma.chatMessage.create({
        data: { userId: user.id, role: "assistant", content: aiText, status: "complete", requestId },
      }),
    ]);

    const remainingToday = limits.chatMessagesPerDay === -1 ? -1 : Math.max(0, limits.chatMessagesPerDay - usageCount);

    return success({
      userMessage: formatChatMessage(userMsgObj),
      assistantMessage: formatChatMessage(assistantMsgObj),
      remainingToday,
    });
  } catch (err: unknown) {
    console.error("Chat API error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    // Surface config errors clearly
    if (message.includes("GROQ_API_KEY")) {
      return error("AI service is not configured. Please set GROQ_API_KEY.", 503);
    }
    return error("Internal server error", 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) return unauthorized();

    const { searchParams } = new URL(request.url);
    const page = parsePositiveInt(searchParams.get("page"), 1, 100000);
    const limit = parsePositiveInt(searchParams.get("limit"), 30, 100);
    if (!page || !limit) return badRequest("Invalid pagination parameters");
    const skip = (page - 1) * limit;

    const limits = getPlanLimits(user.plan);
    const period = utcPeriod();
    const [latestMessages, total, usage] = await Promise.all([
      prisma.chatMessage.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.chatMessage.count({ where: { userId: user.id } }),
      prisma.dailyUsage.findUnique({
        where: { userId_kind_period: { userId: user.id, kind: "chat", period } },
      }),
    ]);

    const formatted: ChatMessageData[] = latestMessages.reverse().map(formatChatMessage);

    const usedToday = usage?.count ?? 0;
    const remainingToday = limits.chatMessagesPerDay === -1
      ? -1
      : Math.max(0, limits.chatMessagesPerDay - usedToday);
    return success({ messages: formatted, total, page, remainingToday });
  } catch (err: unknown) {
    console.error("Chat list error:", err);
    return error("Internal server error", 500);
  }
}

function formatChatMessage(message: {
  id: string;
  role: string;
  content: string;
  status: string;
  createdAt: Date;
}): ChatMessageData {
  return {
    id: message.id,
    role: message.role as "user" | "assistant",
    content: message.content,
    status: message.status as ChatMessageData["status"],
    createdAt: message.createdAt.toISOString(),
  };
}

export async function DELETE(request: NextRequest) {
  try {
    const csrfError = requireSameOrigin(request);
    if (csrfError) return csrfError;
    const user = await getAuthUserFromRequest(request);
    if (!user) return unauthorized();

    await prisma.chatMessage.deleteMany({
      where: { userId: user.id },
    });

    return success({ message: "Chat history cleared successfully" });
  } catch (err: unknown) {
    console.error("Chat clear error:", err);
    return error("Internal server error", 500);
  }
}
