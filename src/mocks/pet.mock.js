import { faker } from "@faker-js/faker";

export const generateMockPets = (quantity) => {
  const pets = [];

  for (let i = 0; i < quantity; i++) {
    pets.push({
      _id: faker.database.mongodbObjectId(),
      name: faker.animal.cat(),
      species: faker.animal.type(),
      age: faker.number.int({ min: 1, max: 15 }),
    });
  }

  return pets;
};
