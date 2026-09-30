"use client";

import { useState, useEffect, useRef } from "react";
import { useToast } from "@/contexts/ToastContext";
import UpgradePrompt from "@/components/dashboard/UpgradePrompt";
import type { ChatMessageData } from "@/types/api";

export default function ChatPage() {
  const { showToast } = useToast();

  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limitReached, setLimitReached] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetch("/api/chat")
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) {
          setMessages(data.messages);
        }
        if (typeof data.remainingToday === "number") {
          setRemaining(data.remainingToday);
          setLimitReached(data.remainingToday === 0);
        }
      })
      .catch(() => showToast("error", "Failed to load chat history"))
      .finally(() => setIsLoading(false));
  }, [showToast]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending || limitReached) return;

    const userText = input.trim();
    const requestId = crypto.randomUUID();
    setInput("");
    setIsSending(true);

    // Optimistic user message append
    const tempUserMsg: ChatMessageData = {
      id: "temp-" + Date.now(),
      role: "user",
      content: userText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, requestId }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setLimitReached(true);
          showToast("info", "Daily limit reached");
        } else {
          showToast("error", data.error || "Failed to send message");
        }
        setIsSending(false);
        setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
        return;
      }

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        data.userMessage,
        data.assistantMessage,
      ]);

      if (typeof data.remainingToday === "number") {
        setRemaining(data.remainingToday);
        if (data.remainingToday === 0) {
          setLimitReached(true);
        }
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
      showToast("error", "Network error. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const [isClearing, setIsClearing] = useState(false);

  const handleClearChat = async () => {
    if (messages.length === 0 || isClearing) return;
    if (!confirm("Are you sure you want to clear your chat history?")) return;

    setIsClearing(true);
    try {
      const res = await fetch("/api/chat", { method: "DELETE" });
      if (res.ok) {
        setMessages([]);
        showToast("info", "Chat history cleared");
      } else {
        const data = await res.json();
        showToast("error", data.error || "Failed to clear chat");
      }
    } catch {
      showToast("error", "Network error. Failed to clear chat.");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)] max-w-5xl mx-auto glass-card-l1 rounded-card border-gold/15 overflow-hidden shadow-2xl">
      {/* Header Bar */}
      <div className="p-4 md:p-5 border-b border-gold/15 flex items-center justify-between glass-card-l2">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gold/10 ring-1 ring-gold/30 shadow-[0_0_20px_rgba(243,198,105,0.2)] text-gold flex items-center justify-center text-2xl shrink-0">
            🔮
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-gold-gradient tracking-[0.05em]">Vedic AI Astrologer</h2>
            <p className="text-[11px] text-text-muted font-sans">AI-generated reflective guidance · not professional advice</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {remaining !== null && remaining !== -1 && (
            <span className="text-xs font-mono font-semibold bg-gold/15 text-gold border border-gold/30 px-3.5 py-1.5 rounded-pill shadow-[0_0_10px_rgba(243,198,105,0.15)]">
              💬 {remaining} message{remaining === 1 ? "" : "s"} left today
            </span>
          )}

          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              disabled={isClearing || isSending}
              className="text-xs font-medium text-text-muted hover:text-red-400 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 px-3 py-1.5 rounded-pill transition-all flex items-center gap-1.5 disabled:opacity-50"
              title="Clear all chat history"
            >
              <span>🗑️</span>
              <span className="hidden sm:inline">{isClearing ? "Clearing..." : "Clear Chat"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-5">
        {isLoading ? (
          <div className="text-center text-text-muted text-sm py-12 font-sans">Loading chat history...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 rounded-full bg-gold/10 ring-1 ring-gold/30 shadow-[0_0_25px_rgba(243,198,105,0.25)] text-gold flex items-center justify-center text-3xl mx-auto">
              ✨
            </div>
            <h3 className="font-serif text-2xl font-bold text-gold-gradient tracking-[0.05em]">
              Ask Any Question About Your Cosmic Journey
            </h3>
            <p className="text-xs text-text-muted max-w-md mx-auto font-sans leading-relaxed">
              Inquire about your career transits, relationship compatibility, favorable Dasha periods, or authentic Vedic remedies.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] px-5 py-3.5 text-sm font-sans ${
                  msg.role === "user"
                    ? "bg-gold/15 border border-gold/30 text-slate-100 rounded-2xl rounded-br-none shadow-[0_4px_15px_rgba(243,198,105,0.1)]"
                    : "bg-surface/90 border border-white/10 text-slate-200 rounded-2xl rounded-bl-none shadow-md"
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
              <span className="text-[10px] font-mono text-text-muted/60 mt-1 px-1.5">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {isSending && (
          <div className="flex flex-col items-start">
            <div className="bg-surface/90 border border-white/10 px-5 py-3.5 rounded-2xl rounded-bl-none flex items-center gap-2 shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-gold animate-bounce shadow-[0_0_8px_rgba(243,198,105,0.6)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-gold animate-bounce [animation-delay:0.2s] shadow-[0_0_8px_rgba(243,198,105,0.6)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-gold animate-bounce [animation-delay:0.4s] shadow-[0_0_8px_rgba(243,198,105,0.6)]" />
            </div>
          </div>
        )}

        {limitReached && (
          <div className="mt-4">
            <UpgradePrompt
              feature="Unlimited AI Astrology Chat"
              message="You have reached your daily 5 free chat messages limit."
            />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-3 md:p-4 glass-card-l2 border-t border-gold/15 flex gap-3 items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={limitReached || isSending}
            placeholder={limitReached ? "Daily message limit reached" : "Ask the AI Astrologer..."}
            className="w-full bg-[#05050B]/80 border border-white/10 rounded-pill px-5 py-3.5 text-sm text-text-primary placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 disabled:opacity-50 font-sans transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim() || limitReached || isSending}
          className="shimmer-sweep bg-gold hover:bg-gold-light text-background font-bold px-7 py-3.5 rounded-pill text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-[0_0_15px_rgba(243,198,105,0.25)]"
        >
          Send ✨
        </button>
      </form>
    </div>
  );
}
