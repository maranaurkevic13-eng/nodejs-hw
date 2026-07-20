import createHttpError from "http-errors";
import { Session } from "../models/session.js";
import { User } from "../models/user.js";

export const authenticate = async (req, res, next) => {
  try {
    const { accessToken, sessionId } = req.cookies;

    // Перевірка наявності обох кукі
    if (!accessToken || !sessionId) {
      throw createHttpError(401, "Missing access token or sessionId");
    }

    // Пошук сесії за sessionId + accessToken
    const session = await Session.findOne({ _id: sessionId, accessToken });
    if (!session) {
      throw createHttpError(401, "Session not found");
    }

    // Перевірка строку дії accessToken
    if (session.accessTokenValidUntil < new Date()) {
      throw createHttpError(401, "Access token expired");
    }

    // Пошук користувача
    const user = await User.findById(session.userId);
    if (!user) {
      throw createHttpError(401);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
