import Link from "next/link";
import { api } from "@/lib/api";
import { QuizSummary } from "@/types";
import DeleteButton from "@/components/DeleteButton";

export const revalidate = 0;

export default async function DashboardPage() {
  let quizzes: QuizSummary[] = [];
  let error = "";

  try {
    quizzes = await api.getQuizzes();
  } catch {
    error = "Не вдалося завантажити квізи. Перевірте чи запущений бекенд.";
  }

  return (
    <div>
      <div className="page-header">
        <h1>Всі квізи</h1>
        <Link href="/create" className="btn btn--primary">
          + Створити квіз
        </Link>
      </div>

      {error && <p className="status-msg text-danger">{error}</p>}

      {!error && quizzes.length === 0 && (
        <div className="status-msg">
          <p>Жодного квізу ще немає.</p>
          <Link href="/create">Створити перший →</Link>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "1rem",
        }}
      >
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="card"
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <Link
                href={`/quiz/${quiz.id}`}
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  color: "var(--color-text)",
                  textDecoration: "none",
                }}
              >
                {quiz.title}
              </Link>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginTop: "0.4rem",
                }}
              >
                <span className="badge">{quiz.questionCount} питань</span>
                <span className="text-faint text-sm">
                  {new Date(quiz.createdAt).toLocaleDateString("uk-UA")}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link href={`/quiz/${quiz.id}`} className="btn btn--sm">
                Деталі
              </Link>
              <DeleteButton quizId={quiz.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
