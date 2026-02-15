import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

export const generateMockUsers = async (quantity) => {
  const users = [];

  for (let i = 0; i < quantity; i++) {
    const hashedPassword = await bcrypt.hash("coder123", 10);

    users.push({
      _id: faker.database.mongodbObjectId(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: hashedPassword,
      role: Math.random() > 0.5 ? "user" : "admin",
      pets: [],
    });
  }

  return users;
};
