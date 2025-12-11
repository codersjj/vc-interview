import request from "../lib/axios";
import type { AxiosResponse } from "axios";
import type {
  CreateSessionRequest,
  CreateSessionResponse,
  SessionListResponse,
  SessionDetailResponse,
  JoinSessionResponse,
  EndSessionResponse,
  StreamTokenResponse,
} from "../types/session";

export const sessionApi = {
  createSession: async (
    data: CreateSessionRequest
  ): Promise<CreateSessionResponse> => {
    const res: AxiosResponse<CreateSessionResponse> = await request.post(
      "/sessions",
      data
    );
    return res.data;
  },
  getActiveSessions: async (): Promise<SessionListResponse> => {
    const res: AxiosResponse<SessionListResponse> = await request.get(
      "/sessions/active"
    );
    return res.data;
  },
  getMyRecentSessions: async (): Promise<SessionListResponse> => {
    const res: AxiosResponse<SessionListResponse> = await request.get(
      "/sessions/my-recent"
    );
    return res.data;
  },
  getSessionsById: async (id: string): Promise<SessionDetailResponse> => {
    const res: AxiosResponse<SessionDetailResponse> = await request.get(
      `/sessions/${id}`
    );
    return res.data;
  },
  joinSession: async (id: string): Promise<JoinSessionResponse> => {
    const res: AxiosResponse<JoinSessionResponse> = await request.post(
      `/sessions/${id}/join`
    );
    return res.data;
  },
  endSession: async (id: string): Promise<EndSessionResponse> => {
    const res: AxiosResponse<EndSessionResponse> = await request.post(
      `/sessions/${id}/end`
    );
    return res.data;
  },
  getStreamToken: async (): Promise<StreamTokenResponse> => {
    const res: AxiosResponse<StreamTokenResponse> = await request.get(
      "/chat/token"
    );
    return res.data;
  },
};
