import { fakerFR as faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";
import type { FakerImplementation } from "./types";

type User = Prisma.userCreateInput;

export class UserFactory implements FakerImplementation {
  constructor(private readonly dbClient: PrismaClient) {}

  private generate = (): User => {
    return {
      email: faker.internet.email(),
      password: faker.internet.password(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      birth_date: faker.date.birthdate(),
      phone_number: faker.phone.number(),
    };
  };

  createOne = async () => {
    const user = this.generate();
    const createdUser = await this.dbClient.user.create({ data: user });

    return createdUser;
  };

  createMany = async (count: number) => {
    const users = Array.from({ length: count }, () => this.generate());
    const createdUsers = await this.dbClient.user.createMany({ data: users });

    return createdUsers;
  };
}
