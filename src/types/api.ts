// Shared response types — used by BOTH API routes and frontend fetch calls

export interface ApiError {
  error: string;
  code?: string;
  upgradeRequired?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: string;
  language: string;
  dateOfBirth: string | null;
  timeOfBirth: string | null;
  placeOfBirth: string | null;
  timeZone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  birthTimeKnown?: boolean;
}

export interface KundliSummary {
  id: string;
  chartType: "vedic" | "western";
  createdAt: string;
  sunSign: string;
  moonSign: string;
  ascendant: string;
  watermarked: boolean;
}

export interface PredictionData {
  summary: string;
  health: string;
  career: string;
  love: string;
  finance: string;
  luckyColor: string;
  luckyNumber: number;
  luckyDirection: string;
  overallRating: number;  // 1-5
}

export interface CompatibilityCategory {
  name: string;
  score: number;
  maxScore: number;
  description: string;
}

export interface CompatibilityResult {
  id: string;
  partnerName: string;
  overallScore: number;
  categories: CompatibilityCategory[] | null;
  createdAt: string;
}

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  status?: "pending" | "complete" | "failed";
  createdAt: string;
}
