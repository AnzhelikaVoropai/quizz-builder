"use client";

import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createQuizSchema, CreateQuizSchema } from "@/lib/schema";
import { api } from "@/lib/api";
import { QuestionType } from "@/types";
import {
  BooleanFields,
  InputFields,
  CheckboxFields,
} from "@/components/QuestionFields";

const DEFAULT_QUESTIONS = {
  BOOLEAN: {
    type: "BOOLEAN" as QuestionType,
    text: "",
    correctAnswer: "true",
    options: "[]",
  },
  INPUT: {
    type: "INPUT" as QuestionType,
    text: "",
    correctAnswer: "",
    options: "[]",
  },
  CHECKBOX: {
    type: "CHECKBOX" as QuestionType,
    text: "",
    correctAnswer: "[]",
    options: "[]",
  },
};

export default function CreatePage() {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateQuizSchema>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      title: "",
      questions: [{ ...DEFAULT_QUESTIONS.BOOLEAN }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  async function onSubmit(data: CreateQuizSchema) {
    try {
      const created = await api.createQuiz(data);
      router.push(`/quiz/${created.id}`);
    } catch (err) {
      alert("Помилка: " + (err as Error).message);
    }
  }

  const sharedProps = { register, watch, setValue, errors };

  return (
    <div>
      <div className="page-header">
        <h1>Створити квіз</h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        {/* Назва */}
        <div className="field">
          <label htmlFor="title" className="field__label">
            Назва квізу *
          </label>
          <input
            id="title"
            type="text"
            className={`field__input ${errors.title ? "field__input--error" : ""}`}
            placeholder="Наприклад: Основи TypeScript"
            {...register("title")}
          />
          {errors.title && (
            <span className="field__error">{errors.title.message}</span>
          )}
        </div>

        {/* Питання */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600 }}>Питання</h2>

          {fields.map((field, index) => {
            const type = watch(`questions.${index}.type`);
            return (
              <div
                key={field.id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                    Питання {index + 1}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                    }}
                  >
                    <select
                      className="field__input"
                      style={{ padding: "4px 8px", fontSize: "0.85rem" }}
                      {...register(`questions.${index}.type`)}
                    >
                      <option value="BOOLEAN">Так / Ні</option>
                      <option value="INPUT">Відкрита відповідь</option>
                      <option value="CHECKBOX">Множинний вибір</option>
                    </select>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        className="btn btn--danger btn--sm"
                        onClick={() => remove(index)}
                      >
                        Видалити
                      </button>
                    )}
                  </div>
                </div>

                <div className="field">
                  <label className="field__label">Текст питання *</label>
                  <input
                    type="text"
                    className={`field__input ${errors.questions?.[index]?.text ? "field__input--error" : ""}`}
                    placeholder="Введіть питання"
                    {...register(`questions.${index}.text`)}
                  />
                  {errors.questions?.[index]?.text && (
                    <span className="field__error">
                      {errors.questions[index]?.text?.message as string}
                    </span>
                  )}
                </div>

                {type === "BOOLEAN" && (
                  <BooleanFields index={index} {...sharedProps} />
                )}
                {type === "INPUT" && (
                  <InputFields index={index} {...sharedProps} />
                )}
                {type === "CHECKBOX" && (
                  <CheckboxFields index={index} {...sharedProps} />
                )}
              </div>
            );
          })}
        </div>

        {/* Додати питання */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 0",
            borderTop: "1px solid var(--color-border)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <span className="text-muted text-sm">Додати:</span>
          <button
            type="button"
            className="btn btn--sm"
            onClick={() => append({ ...DEFAULT_QUESTIONS.BOOLEAN })}
          >
            + Так / Ні
          </button>
          <button
            type="button"
            className="btn btn--sm"
            onClick={() => append({ ...DEFAULT_QUESTIONS.INPUT })}
          >
            + Відкрита відповідь
          </button>
          <button
            type="button"
            className="btn btn--sm"
            onClick={() => append({ ...DEFAULT_QUESTIONS.CHECKBOX })}
          >
            + Множинний вибір
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
          }}
        >
          <button type="button" className="btn" onClick={() => router.back()}>
            Скасувати
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Зберігаємо..." : "Створити квіз"}
          </button>
        </div>
      </form>
    </div>
  );
}
