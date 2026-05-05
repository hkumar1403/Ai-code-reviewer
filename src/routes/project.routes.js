import express from "express";
import {
  createProject,
  getProject,
  getProjects,
  uploadProject,
} from "../controllers/project.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const projectRouter = express.Router();

projectRouter.post("/projects", auth, createProject);
projectRouter.get("/projects", auth, getProjects);
projectRouter.get("/projects/:id", auth, getProject);
projectRouter.post("/upload", auth, upload.single("file"), uploadProject);
export default projectRouter;
