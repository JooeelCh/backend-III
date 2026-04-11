import { verifyJWT } from "../utils/auth.utils.js";

export const authMiddleware = (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Token no provisto",
      });
    }

    const decoded = verifyJWT(token);

    if (!decoded) {
      return res.status(401).json({
        status: "error",
        message: "Token inválido",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
