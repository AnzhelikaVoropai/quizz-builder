import { Quiz, QuizSummary } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      (error as { error?: string }).error ?? `HTTP ${res.status}`,
    );
  }
  return res.json() as Promise<T>;
}

export const api = {
  getQuizzes: () => request<QuizSummary[]>("/quizzes"),
  getQuiz: (id: number) => request<Quiz>(`/quizzes/${id}`),
  createQuiz: (data: unknown) =>
    request<Quiz>("/quizzes", { method: "POST", body: JSON.stringify(data) }),
  deleteQuiz: (id: number) =>
    request<{ message: string }>(`/quizzes/${id}`, { method: "DELETE" }),
};
