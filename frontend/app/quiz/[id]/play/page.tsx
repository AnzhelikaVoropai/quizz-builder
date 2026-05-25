"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Quiz, Question } from "@/types";

type Mode = "play" | "done";

export default function PlayPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("play");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedMany, setSelectedMany] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    api
      .getQuiz(parseInt(id))
      .then(setQuiz)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="status-msg">Завантаження...</p>;
  if (!quiz) return <p className="status-msg">Квіз не знайдено</p>;

  const question: Question = quiz.questions[currentQ];
  const isLast = currentQ === quiz.questions.length - 1;
  const options: string[] = question.options
    ? JSON.parse(question.options)
    : [];

  function handleConfirm() {
    if (question.type === "CHECKBOX") {
      if (selectedMany.length === 0) return;
      setAnswers((prev) => [...prev, JSON.stringify(selectedMany.sort())]);
    } else {
      if (!selected) return;
      setAnswers((prev) => [...prev, selected]);
    }
    setAnswered(true);
  }

  function handleNext() {
    if (isLast) {
      setMode("done");
    } else {
      setCurrentQ((prev) => prev + 1);
      setSelected(null);
      setSelectedMany([]);
      setAnswered(false);
    }
  }

  function toggleMany(opt: string) {
    if (answered) return;
    setSelectedMany((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt],
    );
  }

  function getScore() {
    return quiz!.questions.reduce((acc, q, i) => {
      const userAnswer = answers[i];
      if (q.type === "CHECKBOX") {
        const correct = JSON.parse(q.correctAnswer) as string[];
        const user = JSON.parse(userAnswer ?? "[]") as string[];
        return (
          acc +
          (JSON.stringify(correct.sort()) === JSON.stringify(user.sort())
            ? 1
            : 0)
        );
      }
      return acc + (userAnswer === q.correctAnswer ? 1 : 0);
    }, 0);
  }

  function isCorrectOption(opt: string): boolean {
    if (question.type === "CHECKBOX") {
      const correct = JSON.parse(question.correctAnswer) as string[];
      return correct.includes(opt);
    }
    return opt === question.correctAnswer;
  }

  function getOptionClass(opt: string): string {
    if (!answered) {
      const isSelected =
        question.type === "CHECKBOX"
          ? selectedMany.includes(opt)
          : selected === opt;
      return isSelected ? "play-option play-option--selected" : "play-option";
    }
    if (isCorrectOption(opt)) return "play-option play-option--correct";
    const isSelected =
      question.type === "CHECKBOX"
        ? selectedMany.includes(opt)
        : selected === opt;
    return isSelected ? "play-option play-option--wrong" : "play-option";
  }

  // ── Результати ────────────────────────────────────────────
  if (mode === "done") {
    const score = getScore();
    const total = quiz.questions.length;
    const percent = Math.round((score / total) * 100);

    return (
      <div className="play-result">
        <h1>Результат</h1>
        <div className="score-circle">
          <span className="score-number">
            {score}/{total}
          </span>
          <span className="score-percent">{percent}%</span>
        </div>
        <p className="score-label">
          {percent === 100 && "Відмінно! 🎉"}
          {percent >= 70 && percent < 100 && "Добре! 👍"}
          {percent >= 40 && percent < 70 && "Непогано 📚"}
          {percent < 40 && "Спробуй ще раз 💪"}
        </p>

        <div className="result-breakdown">
          {quiz.questions.map((q, i) => {
            const isCorrect = (() => {
              if (q.type === "CHECKBOX") {
                const correct = JSON.parse(q.correctAnswer) as string[];
                const user = JSON.parse(answers[i] ?? "[]") as string[];
                return (
                  JSON.stringify(correct.sort()) === JSON.stringify(user.sort())
                );
              }
              return answers[i] === q.correctAnswer;
            })();
            return (
              <div
                key={q.id}
                className={`result-item ${isCorrect ? "result-item--correct" : "result-item--wrong"}`}
              >
                <span className="result-mark">{isCorrect ? "✓" : "✗"}</span>
                <div>
                  <p className="result-q">{q.text}</p>
                  {!isCorrect && (
                    <p className="result-hint">
                      Правильно:{" "}
                      <strong>
                        {q.type === "BOOLEAN"
                          ? q.correctAnswer === "true"
                            ? "Правда"
                            : "Неправда"
                          : q.type === "CHECKBOX"
                            ? (JSON.parse(q.correctAnswer) as string[]).join(
                                ", ",
                              )
                            : q.correctAnswer}
                      </strong>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="result-actions">
          <button
            className="btn btn--primary"
            onClick={() => {
              setMode("play");
              setCurrentQ(0);
              setAnswers([]);
              setSelected(null);
              setSelectedMany([]);
              setAnswered(false);
            }}
          >
            Пройти знову
          </button>
          <button className="btn" onClick={() => router.push(`/quiz/${id}`)}>
            До квізу
          </button>
          <button className="btn" onClick={() => router.push("/")}>
            До списку
          </button>
        </div>
      </div>
    );
  }

  // ── Гра ───────────────────────────────────────────────────
  return (
    <div>
      <div className="play-header">
        <span className="play-title">{quiz.title}</span>
        <span className="play-counter">
          {currentQ + 1} / {quiz.questions.length}
        </span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${((currentQ + 1) / quiz.questions.length) * 100}%`,
          }}
        />
      </div>

      <div className="card play-card">
        <h2 className="play-question">{question.text}</h2>

        <ul className="play-options">
          {question.type === "BOOLEAN" &&
            ["true", "false"].map((val) => (
              <li
                key={val}
                className={getOptionClass(val)}
                onClick={() => {
                  if (!answered) setSelected(val);
                }}
              >
                {val === "true" ? "Правда" : "Неправда"}
                {answered && isCorrectOption(val) && (
                  <span className="option-mark">✓</span>
                )}
                {answered && !isCorrectOption(val) && selected === val && (
                  <span className="option-mark">✗</span>
                )}
              </li>
            ))}

          {question.type === "INPUT" && (
            <li style={{ listStyle: "none" }}>
              <input
                type="text"
                className="field__input"
                placeholder="Ваша відповідь"
                disabled={answered}
                value={selected ?? ""}
                onChange={(e) => setSelected(e.target.value)}
                style={{ width: "100%" }}
              />
              {answered && (
                <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                  {selected?.toLowerCase().trim() ===
                  question.correctAnswer.toLowerCase().trim() ? (
                    <span style={{ color: "var(--color-success-text)" }}>
                      ✓ Правильно!
                    </span>
                  ) : (
                    <span style={{ color: "var(--color-danger-text)" }}>
                      ✗ Правильна відповідь:{" "}
                      <strong>{question.correctAnswer}</strong>
                    </span>
                  )}
                </p>
              )}
            </li>
          )}

          {question.type === "CHECKBOX" &&
            options.map((opt) => (
              <li
                key={opt}
                className={getOptionClass(opt)}
                onClick={() => toggleMany(opt)}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid currentColor",
                      borderRadius: 3,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {(answered
                      ? isCorrectOption(opt)
                      : selectedMany.includes(opt)) && "✓"}
                  </span>
                  {opt}
                </span>
                {answered && isCorrectOption(opt) && (
                  <span className="option-mark">✓</span>
                )}
                {answered &&
                  !isCorrectOption(opt) &&
                  selectedMany.includes(opt) && (
                    <span className="option-mark">✗</span>
                  )}
              </li>
            ))}
        </ul>

        <div className="play-actions">
          {!answered ? (
            <button
              className="btn btn--primary"
              onClick={handleConfirm}
              disabled={
                question.type === "CHECKBOX"
                  ? selectedMany.length === 0
                  : !selected
              }
            >
              Підтвердити
            </button>
          ) : (
            <button className="btn btn--primary" onClick={handleNext}>
              {isLast ? "Завершити" : "Наступне →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
