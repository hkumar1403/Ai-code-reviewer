import { Project } from "../models/project.model.js";

// function to create a project ->

export const createProject = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Code is required",
      });
    }

    const project = await Project.create({
      user: req.user.id,
      code,
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// function to get all the projects ->
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
