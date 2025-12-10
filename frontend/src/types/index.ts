export const DIFFICULTY = {
    EASY: "Easy",
    MEDIUM: "Medium",
    HARD: "Hard",
} as const;

export type Difficulty = (typeof DIFFICULTY)[keyof typeof DIFFICULTY];
