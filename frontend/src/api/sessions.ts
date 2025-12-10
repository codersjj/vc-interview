import request from "../lib/axios";

export const sessionApi = {
  createSession: async (data: { problem: string; difficulty: string }) => {
    const res = await request.post("/sessions", data);
    return res.data;
  },
  getActiveSessions: async () => {
    const res = await request.get("/sessions/active");
    return res.data;
  },
  getMyRecentSessions: async () => {
    const res = await request.get("/sessions/my-recent");
    return res.data;
  },
  getSessionsById: async (id: string) => {
    const res = await request.get(`/sessions/${id}`);
    return res.data;
  },
  joinSession: async (id: string) => {
    const res = await request.post(`/sessions/${id}/join`);
    return res.data;
  },
  endSession: async (id: string) => {
    const res = await request.post(`/sessions/${id}/end`);
    return res.data;
  },
  getStreamToken: async () => {
    const res = await request.get("/chat/token");
    return res.data;
  },
};
