import { adoptionsService } from "../services/adoptions.service.js";
import { errorResponse, successResponse } from "../dto/response.dto.js";

export const getAdoptions = async (req, res) => {
  try {
    const adoptions = await adoptionsService.getAll();
    return res.json(successResponse(adoptions));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const getAdoptionById = async (req, res) => {
  try {
    const result = await adoptionsService.getById(req.params.aid);

    if (result.error) {
      return res.status(result.code).json(errorResponse(result.error));
    }

    return res.json(successResponse(result.data));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const createAdoption = async (req, res) => {
  try {
    const result = await adoptionsService.create(
      req.params.uid,
      req.params.pid,
    );

    if (result.error) {
      return res.status(result.code).json(errorResponse(result.error));
    }

    return res
      .status(result.code ?? 201)
      .json(
        successResponse(result.data, {
          message: result.message ?? "Adopción registrada correctamente",
        }),
      );
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};
