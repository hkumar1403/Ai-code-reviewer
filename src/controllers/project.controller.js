import { Project } from "../models/project.model.js";
import { generateReview } from "../services/ai.service.js";

export const createProject = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code.trim()) {
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const projects = await Project.find({ user: req.user.id })
      .select("code review createdAt user")
      .populate("user", "username email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Project.countDocuments({
      user: req.user.id,
    });

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
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
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

    const allowedExtensions = [".js", ".ts"];
    const isValid = allowedExtensions.some((ext) =>
      file.originalname.endsWith(ext),
    );
    if (!isValid) {
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
