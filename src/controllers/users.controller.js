import { usersService } from "../services/users.service.js";
import { errorResponse, successResponse } from "../dto/response.dto.js";

export const getUsers = async (req, res) => {
  try {
    const users = await usersService.getAll();
    return res.json(successResponse(users));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const getUserById = async (req, res) => {
  try {
    const result = await usersService.getById(req.params.uid);

    if (result.error) {
      return res.status(result.code).json(errorResponse(result.error));
    }

    return res.json(successResponse(result.data));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const createUser = async (req, res) => {
  try {
    const result = await usersService.create(req.body);

    if (result.error) {
      return res.status(result.code).json(errorResponse(result.error));
    }

    return res.status(result.code ?? 201).json(successResponse(result.data));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const updateUser = async (req, res) => {
  try {
    const result = await usersService.update(req.params.uid, req.body);

    if (result.error) {
      return res.status(result.code).json(errorResponse(result.error));
    }

    return res.json(successResponse(result.data));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await usersService.delete(req.params.uid);

    if (result.error) {
      return res.status(result.code).json(errorResponse(result.error));
    }

    return res.json({ status: "success", ...result.data });
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};
