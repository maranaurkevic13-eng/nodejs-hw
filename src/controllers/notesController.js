import createHttpError from "http-errors";
import { Note } from "../models/note.js";

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;

    const query = Note.find({ userId: req.user._id });

    if (tag) query.where({ tag });
    if (search) {
      query.where({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } }
        ]
      });
    }

    const totalNotes = await Note.countDocuments(query.getFilter());
    const totalPages = Math.ceil(totalNotes / perPage);

    const notes = await query
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
      totalNotes,
      totalPages,
      notes
    });
  } catch (err) {
    next(err);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.noteId,
      userId: req.user._id
    });
    if (!note) throw createHttpError(404, "Note not found");
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create({
      ...req.body,
      userId: req.user._id
    });
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.noteId, userId: req.user._id },
      req.body,
      { returnDocument: "after" }
    );
    if (!note) throw createHttpError(404, "Note not found");
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.noteId,
      userId: req.user._id
    });
    if (!note) throw createHttpError(404, "Note not found");
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};
