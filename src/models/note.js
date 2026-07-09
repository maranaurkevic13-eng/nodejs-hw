import mongoose from "mongoose";
import { TAGS } from "../constants/tags.js";

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: "" },
  tag: { type: String, enum: TAGS }
}, { timestamps: true });

noteSchema.index({ tag: 1 });

export const Note = mongoose.model("Note", noteSchema);
