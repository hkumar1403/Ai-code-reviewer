import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(authRouter);
app.use(projectRouter);

connectDb();
const PORT = process.env.PORT || 3000;

if (!process.env.PORT) {
  console.log("PORT not defined in .env");
}

if (!process.env.JWT_SECRET) {
  console.log("JWT_SECRET not defined in .env");
}

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
