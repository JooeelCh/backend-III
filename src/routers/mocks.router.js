import { Router } from "express";
import { generateMockUsers } from "../mocks/user.mock.js";
import { generateMockPets } from "../mocks/pet.mock.js";
import User from "../models/User.js";
import Pet from "../models/Pet.js";

const router = Router();

router.get("/mockingpets", (req, res) => {
  const pets = generateMockPets(20);
  res.json({ status: "success", payload: pets });
});

router.get("/mockingusers", async (req, res) => {
  try {
    const users = await generateMockUsers(50);

    res.json({
      status: "success",
      payload: users,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.post("/generateData", async (req, res) => {
  try {
    const { users = 0, pets = 0 } = req.body;

    const mockUsers = await generateMockUsers(users);
    const mockPets = generateMockPets(pets);

    await User.insertMany(mockUsers);
    await Pet.insertMany(mockPets);

    res.json({
      status: "success",
      message: "Datos generados e insertados correctamente",
      insertedUsers: users,
      insertedPets: pets,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;
