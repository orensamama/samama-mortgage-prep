import questionsData from "@/data/questions.json";

export type Difficulty = "easy" | "medium" | "hard";

export type Question = {
  id: string;
  category: string;
  tags: string[];
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  detailedExplanation: string;
  difficulty: Difficulty;
};

export const questions = questionsData as Question[];
