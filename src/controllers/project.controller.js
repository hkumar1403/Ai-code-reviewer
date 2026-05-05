import { Project } from "../models/project.model.js";
import { generateReview } from "../services/ai.service.js";

export const createProject = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "Bad request",
      });
    }

    const { id } = req.user;

    const codeReview = await generateReview(code);
    const newProject = await Project.create({
      user: id,
      code,
      review: codeReview,
    });
    res.status(201).json({
      success: true,
      data: newProject,
      message: "Project created",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create project. Please try later",
    });
  }
};

// Fetch all projects -->
export const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find({ user: userId })
      .sort({
        createdAt: -1,
      })
      .limit(10);

    if (projects.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No projects found",
      });
    }

    res.status(200).json({
      success: true,
      data: projects,
      message: "Here are all your projects",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      data: [],
      message: "Server error. Please try later",
    });
  }
};

// Fetch only one project -->

export const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const project = await Project.findOne({
      _id: id,
      user: userId,
    });
    if (!project) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Project not found",
      });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
      message: "Here is your project",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      data: [],
      message: "Server error. Please try later",
    });
  }
};

// Upload a project using multer -->

export const uploadProject = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File required",
      });
    }

    if (!file.mimetype.includes("javascript")) {
      return res.status(400).json({
        success: false,
        message: "Only JS files allowed",
      });
    }

    const code = file.buffer.toString();

    let codeReview;
    try {
      codeReview = await generateReview(code);
    } catch {
      codeReview = {
        bugs: [],
        improvements: [],
        summary: "AI failed to generate review",
      };
    }
    const newProject = await Project.create({
      user: req.user.id,
      code,
      review: codeReview,
    });

    res.status(201).json({
      success: true,
      data: newProject,
      message: "File processed",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
