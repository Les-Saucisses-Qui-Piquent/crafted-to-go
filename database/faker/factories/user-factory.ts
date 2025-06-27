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
    const users = await Promise.all(Array.from({ length: count }, () => this.createOne()));

    return users;
  };

  createAdmin = async () => {
    const adminData: User = {
      email: "admin@rncp.com",
      password:
        "$argon2id$v=19$m=65536,t=3,p=1$eFPrnaFcPLt8ff54TFNiFw$jKwQduhgtNTB+5Sf5VMWr4JLjRcs7buHDdN/QjgMJFA",
      first_name: "Admin",
      last_name: "Admin",
      birth_date: new Date("1990-01-01"),
      phone_number: "0000000000",
      role: "admin",
    };

    const adminUser = await this.dbClient.user.create({ data: adminData });

    return adminUser;
  };
}
