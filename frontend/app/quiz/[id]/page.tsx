import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { Question } from "@/types";
import DeleteButton from "@/components/DeleteButton";

const TYPE_LABEL: Record<string, string> = {
  BOOLEAN: "Так / Ні",
  INPUT: "Відкрита відповідь",
  CHECKBOX: "Множинний вибір",
};

function QuestionCard({
  question,
  index,
}: {
  question: Question;
  index: number;
}) {
  const options: string[] = question.options
    ? JSON.parse(question.options)
    : [];
  const correctAnswers: string[] =
    question.type === "CHECKBOX"
      ? JSON.parse(question.correctAnswer)
      : [question.correctAnswer];

  return (
    <div
      className="card"
      style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "var(--color-hover-bg)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.8rem",
            fontWeight: 600,
          }}
        >
          {index + 1}
        </span>
        <span className="badge">{TYPE_LABEL[question.type]}</span>
      </div>

      <p style={{ fontWeight: 500 }}>{question.text}</p>

      {question.type === "BOOLEAN" && (
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
          }}
        >
          {["true", "false"].map((val) => (
            <li
              key={val}
              style={{
                padding: "7px 12px",
                border: `1px solid ${correctAnswers.includes(val) ? "var(--color-success-border)" : "var(--color-border)"}`,
                borderRadius: 6,
                background: correctAnswers.includes(val)
                  ? "var(--color-success-bg)"
                  : "transparent",
                color: correctAnswers.includes(val)
                  ? "var(--color-success-text)"
                  : "inherit",
                fontSize: "0.9rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {val === "true" ? "Правда" : "Неправда"}
              {correctAnswers.includes(val) && (
                <span style={{ fontWeight: 700 }}>✓</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {question.type === "INPUT" && (
        <p style={{ fontSize: "0.95rem" }}>
          <span className="text-muted text-sm">Правильна відповідь: </span>
          <strong>{question.correctAnswer}</strong>
        </p>
      )}

      {question.type === "CHECKBOX" && (
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
          }}
        >
          {options.map((opt) => (
            <li
              key={opt}
              style={{
                padding: "7px 12px",
                border: `1px solid ${correctAnswers.includes(opt) ? "var(--color-success-border)" : "var(--color-border)"}`,
                borderRadius: 6,
                background: correctAnswers.includes(opt)
                  ? "var(--color-success-bg)"
                  : "transparent",
                color: correctAnswers.includes(opt)
                  ? "var(--color-success-text)"
                  : "inherit",
                fontSize: "0.9rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {opt}
              {correctAnswers.includes(opt) && (
                <span style={{ fontWeight: 700 }}>✓</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function QuizDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = parseInt(id);
  if (isNaN(numId)) notFound();

  let quiz;
  try {
    quiz = await api.getQuiz(numId);
  } catch {
    notFound();
  }

  return (
    <div>
      <Link
        href="/"
        className="btn btn--ghost btn--sm"
        style={{ marginBottom: "1rem" }}
      >
        ← Назад
      </Link>

      <div className="page-header">
        <div>
          <h1>{quiz.title}</h1>
          <p className="text-faint text-sm" style={{ marginTop: "0.25rem" }}>
            Створено {new Date(quiz.createdAt).toLocaleDateString("uk-UA")} •{" "}
            {quiz.questions.length} питань
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Link href={`/quiz/${quiz.id}/play`} className="btn btn--primary">
            ▶ Грати
          </Link>
          <DeleteButton quizId={quiz.id} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {quiz.questions.map((q, i) => (
          <QuestionCard key={q.id} question={q} index={i} />
        ))}
      </div>
    </div>
  );
}
