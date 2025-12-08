export const DIFFICULTY = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
} as const;

export type Difficulty = (typeof DIFFICULTY)[keyof typeof DIFFICULTY];

export const getDifficultyBadgeClass = (difficulty: Difficulty) => {
  switch (difficulty) {
    case DIFFICULTY.EASY:
      return "badge-success";
    case DIFFICULTY.MEDIUM:
      return "badge-warning";
    case DIFFICULTY.HARD:
      return "badge-error";
    default:
      return "badge-ghost";
  }
};
