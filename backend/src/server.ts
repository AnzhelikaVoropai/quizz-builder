import "dotenv/config";
import express from "express";
import cors from "cors";
import quizzesRouter from "./quizzes/quizzes.router";

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use("/quizzes", quizzesRouter);

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
