import { type Difficulty, DIFFICULTY } from "../types";

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
