import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    review: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export const Project = mongoose.model("Project", projectSchema);
