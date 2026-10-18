import questionsData from "@/data/questions.json";

export type Difficulty = "easy" | "medium" | "hard";

export type QuestionSource = "official_exam" | "samama_practice";

export type ConceptFaq = {
  question: string;
  answer: string;
};

export type Question = {
  id: string;
  source: QuestionSource;
  category: string;
  tags: string[];
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  detailedExplanation: string;
  conceptFaqs: ConceptFaq[];
  difficulty: Difficulty;
};

export const questions = questionsData as Question[];
