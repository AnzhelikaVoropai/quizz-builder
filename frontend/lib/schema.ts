import { z } from "zod";

const booleanQuestion = z.object({
  type: z.literal("BOOLEAN"),
  text: z.string().min(1, "Текст питання обовʼязковий"),
  correctAnswer: z.enum(["true", "false"], {
    errorMap: () => ({ message: "Оберіть правильну відповідь" }),
  }),
  options: z.string().optional(),
});

const inputQuestion = z.object({
  type: z.literal("INPUT"),
  text: z.string().min(1, "Текст питання обовʼязковий"),
  correctAnswer: z.string().min(1, "Введіть правильну відповідь"),
  options: z.string().optional(),
});

const checkboxQuestion = z.object({
  type: z.literal("CHECKBOX"),
  text: z.string().min(1, "Текст питання обовʼязковий"),
  correctAnswer: z.string().min(1, "Оберіть хоча б одну правильну відповідь"),
  options: z.string().min(1, "Додайте варіанти відповіді"),
});

export const createQuizSchema = z.object({
  title: z.string().min(3, "Назва має містити мінімум 3 символи"),
  questions: z
    .array(
      z.discriminatedUnion("type", [
        booleanQuestion,
        inputQuestion,
        checkboxQuestion,
      ]),
    )
    .min(1, "Додайте хоча б одне питання"),
});

export type CreateQuizSchema = z.infer<typeof createQuizSchema>;
