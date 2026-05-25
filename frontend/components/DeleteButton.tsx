"use client";

import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface Props {
  quizId: number;
}

export default function DeleteButton({ quizId }: Props) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Видалити цей квіз?")) return;
    try {
      await api.deleteQuiz(quizId);
      router.refresh();
    } catch (err) {
      alert("Помилка: " + (err as Error).message);
    }
  }

  return (
    <button onClick={handleDelete} className="btn btn--danger btn--sm">
      Видалити
    </button>
  );
}
