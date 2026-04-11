import { petsService } from "../services/pets.service.js";
import { errorResponse, successResponse } from "../dto/response.dto.js";

export const getPets = async (req, res) => {
  try {
    const pets = await petsService.getAll();
    return res.json(successResponse(pets));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const getPetById = async (req, res) => {
  try {
    const result = await petsService.getById(req.params.pid);

    if (result.error) {
      return res.status(result.code).json(errorResponse(result.error));
    }

    return res.json(successResponse(result.data));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const createPet = async (req, res) => {
  try {
    const result = await petsService.create(req.body);

    if (result.error) {
      return res.status(result.code).json(errorResponse(result.error));
    }

    return res.status(result.code ?? 201).json(successResponse(result.data));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const updatePet = async (req, res) => {
  try {
    const result = await petsService.update(req.params.pid, req.body);

    if (result.error) {
      return res.status(result.code).json(errorResponse(result.error));
    }

    return res.json(successResponse(result.data));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};

export const deletePet = async (req, res) => {
  try {
    const result = await petsService.delete(req.params.pid);

    if (result.error) {
      return res.status(result.code).json(errorResponse(result.error));
    }

    return res.json(successResponse(result.data));
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};
