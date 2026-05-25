import prisma from "../prisma";

export const quizzesService = {
  async create(data: {
    title: string;
    questions: {
      type: "BOOLEAN" | "INPUT" | "CHECKBOX";
      text: string;
      correctAnswer: string;
      options?: string;
    }[];
  }) {
    return prisma.quiz.create({
      data: {
        title: data.title,
        questions: {
          create: data.questions.map((q, index) => ({
            type: q.type,
            text: q.text,
            correctAnswer: q.correctAnswer,
            options: q.options ?? null,
            order: index,
          })),
        },
      },
      include: { questions: true },
    });
  },

  async findAll() {
    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return quizzes.map(({ _count, ...rest }) => ({
      ...rest,
      questionCount: _count.questions,
    }));
  },

  async findOne(id: number) {
    return prisma.quiz.findUnique({
      where: { id },
      include: { questions: { orderBy: { order: "asc" } } },
    });
  },

  async remove(id: number) {
    return prisma.quiz.delete({ where: { id } });
  },
};
