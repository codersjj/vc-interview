export const DIFFICULTY = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
} as const;

export type Difficulty = (typeof DIFFICULTY)[keyof typeof DIFFICULTY];

export type Session = {
  _id: string;
  callId: string;
  problem: string;
  difficulty: "easy" | "medium" | "hard";
  host: {
    _id: string;
    email: string;
    name: string;
    profileImage: string;
    clerkId: string;
  };
  participant?: {
    _id: string;
    email: string;
    name: string;
    profileImage: string;
    clerkId: string;
  };
  createdAt: Date;
  updatedAt: Date;
  status: "active" | "completed";
};
