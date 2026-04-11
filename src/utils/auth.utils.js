import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "coderSecret";

export const hashPassword = (password) => bcrypt.hash(password, 10);

export const verifyPassword = (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);

export const generateJWT = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    SECRET,
    { expiresIn: "1h" },
  );
};

export const verifyJWT = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
};

export const sanitizeUser = (userDoc) => {
  if (!userDoc) return null;

  const user =
    typeof userDoc.toObject === "function"
      ? userDoc.toObject()
      : { ...userDoc };

  delete user.password;
  return user;
};
