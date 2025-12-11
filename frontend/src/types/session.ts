import type { Session } from "./index";

// API Response Types
export interface CreateSessionResponse {
  session: Session;
}

export interface SessionListResponse {
  sessions: Session[];
}

export interface SessionDetailResponse {
  session: Session;
}

export interface JoinSessionResponse {
  session: Session;
}

export interface EndSessionResponse {
  session: Session;
  message: string;
}

export interface StreamTokenResponse {
  token: string;
  userId: string;
  userName: string;
  userImage: string;
}

// API Request Types
export interface CreateSessionRequest {
  problem: string;
  difficulty: string;
}
