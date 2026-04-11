import { errorResponse, successResponse } from "../dto/response.dto.js";
import { sessionsService } from "../services/sessions.service.js";

export const registerSession = async (req, res) => {
  try {
    const result = await sessionsService.register(req.body ?? {});

    if (result.error) {
      return res.status(result.code).json(errorResponse(result.error));
    }

    return res.status(result.code ?? 201).json(successResponse(result.data));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const loginSession = async (req, res) => {
  try {
    const result = await sessionsService.login(req.body ?? {});

    if (result.error) {
      return res.status(result.code).json(errorResponse(result.error));
    }

    res.cookie("token", result.data.token, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 1000,
    });

    return res.json({
      status: "success",
      token: result.data.token,
    });
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const currentSession = async (req, res) => {
  try {
    const result = await sessionsService.current(req.user);

    if (result.error) {
      return res.status(result.code).json(errorResponse(result.error));
    }

    return res.json(successResponse(result.data));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const logoutSession = async (req, res) => {
  try {
    res.clearCookie("token");

    const result = sessionsService.logout();

    return res.json({ status: "success", ...result.data });
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};
