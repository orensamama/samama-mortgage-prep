import openQuestionsData from "@/data/openQuestions.json";

export type Difficulty = "easy" | "medium" | "hard";

export type QuestionSource = "official_exam" | "samama_practice";

export type OpenQuestion = {
  id: string;
  source: QuestionSource;
  category: string;
  tags: string[];
  difficulty: Difficulty;
  scenario: string;
  question: string;
  solution: string;
};

export const openQuestions = openQuestionsData as OpenQuestion[];

export function getOpenQuestionsByTag(tag: string) {
  return openQuestions.filter((q) => q.tags.includes(tag));
}
