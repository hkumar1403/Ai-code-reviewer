import express from "express";
import {
  createProject,
  getProjects,
} from "../controllers/project.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const projectRouter = express.Router();

projectRouter.post("/projects", auth, createProject);
projectRouter.get("/projects", auth, getProjects);

export default projectRouter;
