import { Project } from "../models/project.model.js";

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

    const newProject = await Project.create({ user: id, code });
    res.status(201).json({
      success: true,
      data: newProject,
      message: "Project created",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try later",
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find({ user: userId });

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
