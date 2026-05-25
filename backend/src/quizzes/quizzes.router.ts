import { Router, Request, Response } from "express";
import { quizzesService } from "./quizzes.service";

const router = Router();

// POST /quizzes
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, questions } = req.body;
    if (!title || !questions?.length) {
      res.status(400).json({ error: "title і questions обовʼязкові" });
      return;
    }
    const quiz = await quizzesService.create({ title, questions });
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// GET /quizzes
router.get("/", async (_req: Request, res: Response) => {
  try {
    const quizzes = await quizzesService.findAll();
    res.json(quizzes);
  } catch {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// GET /quizzes/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) {
      res.status(400).json({ error: "Невалідний id" });
      return;
    }
    const quiz = await quizzesService.findOne(id);
    if (!quiz) {
      res.status(404).json({ error: "Квіз не знайдено" });
      return;
    }
    res.json(quiz);
  } catch {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// DELETE /quizzes/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) {
      res.status(400).json({ error: "Невалідний id" });
      return;
    }
    await quizzesService.remove(id);
    res.json({ message: "Квіз видалено" });
  } catch {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

export default router;
