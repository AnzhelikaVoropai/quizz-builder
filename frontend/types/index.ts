export type QuestionType = "BOOLEAN" | "INPUT" | "CHECKBOX";

export interface Question {
  id: number;
  quizId: number;
  type: QuestionType;
  text: string;
  correctAnswer: string;
  options: string | null;
  order: number;
}

export interface QuizSummary {
  id: number;
  title: string;
  createdAt: string;
  questionCount: number;
}

export interface Quiz {
  id: number;
  title: string;
  createdAt: string;
  questions: Question[];
}
