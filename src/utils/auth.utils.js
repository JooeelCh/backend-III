import bcrypt from "bcrypt";
import crypto from "node:crypto";

export const hashPassword = (password) => bcrypt.hash(password, 10);

export const verifyPassword = (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);

export const generateSessionToken = () =>
  crypto.randomBytes(32).toString("hex");

export const sanitizeUser = (userDoc) => {
  if (!userDoc) return null;

  const user =
    typeof userDoc.toObject === "function"
      ? userDoc.toObject()
      : { ...userDoc };
  delete user.password;
  return user;
};
