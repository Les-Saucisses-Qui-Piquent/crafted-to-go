import { fakerFR as faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";

type User = Prisma.userCreateInput;

export const userFactory = (dbClient: PrismaClient) => {
  const generateUser = (): User => {
    return {
      email: faker.internet.email(),
      password: faker.internet.password(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      birth_date: faker.date.birthdate(),
      phone_number: faker.phone.number(),
    };
  };

  const createOne = async () => {
    const user = generateUser();
    const createdUser = await dbClient.user.create({ data: user });

    return createdUser;
  };

  const createMany = async (count: number) => {
    const users = Array.from({ length: count }, () => generateUser());
    const createdUsers = await dbClient.user.createMany({ data: users });

    return createdUsers;
  };

  return { createOne, createMany };
};
