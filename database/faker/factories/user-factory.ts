import { fakerFR as faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";
import type { FakerImplementation } from "./types";

type User = Prisma.userCreateInput;

export class UserFactory implements FakerImplementation {
  constructor(private readonly dbClient: PrismaClient) {}

  private generate = (addressId: string): User => {
    return {
      email: faker.internet.email(),
      password: faker.internet.password(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      birth_date: faker.date.birthdate(),
      phone_number: faker.phone.number(),
      role: faker.helpers.arrayElement(["brewer", "client"]),
      address_fk: { connect: { id: addressId } },
    };
  };

  createOne = async (addressId: string) => {
    const user = this.generate(addressId);
    const createdUser = await this.dbClient.user.create({
      data: user,
    });

    return createdUser;
  };

  createMany = async (count: number, addressId: string) => {
    const users = await Promise.all(Array.from({ length: count }, () => this.createOne(addressId)));

    return users;
  };

  createAdmin = async (addressId: string) => {
    const adminData: User = {
      email: "admin@rncp.com",
      password:
        "$argon2id$v=19$m=65536,t=3,p=1$eFPrnaFcPLt8ff54TFNiFw$jKwQduhgtNTB+5Sf5VMWr4JLjRcs7buHDdN/QjgMJFA",
      first_name: "Admin",
      last_name: "Admin",
      birth_date: new Date("1990-01-01"),
      phone_number: "0000000000",
      role: "admin",
      address_fk: { connect: { id: addressId } },
    };

    const adminUser = await this.dbClient.user.create({ data: adminData });

    return adminUser;
  };

  createBrewerAdmin = async (addressId: string) => {
    const brewerAdminData: User = {
      email: "brewer@rncp.com",
      password:
        "$argon2id$v=19$m=65536,t=3,p=1$eFPrnaFcPLt8ff54TFNiFw$jKwQduhgtNTB+5Sf5VMWr4JLjRcs7buHDdN/QjgMJFA",
      first_name: "Brewer",
      last_name: "Brewer",
      birth_date: new Date("1990-01-01"),
      phone_number: "0000000000",
      role: "brewer",
      address_fk: { connect: { id: addressId } },
    };

    const brewerAdminUser = await this.dbClient.user.create({ data: brewerAdminData });

    return brewerAdminUser;
  };

  createClientAdmin = async (addressId: string) => {
    const clientData: User = {
      email: "client@rncp.com",
      password:
        "$argon2id$v=19$m=65536,t=3,p=1$eFPrnaFcPLt8ff54TFNiFw$jKwQduhgtNTB+5Sf5VMWr4JLjRcs7buHDdN/QjgMJFA",
      first_name: "Client",
      last_name: "Client",
      birth_date: new Date("1990-01-01"),
      phone_number: "0000000000",
      role: "client",
      address_fk: { connect: { id: addressId } },
    };

    const clientUser = await this.dbClient.user.create({ data: clientData });

    return clientUser;
  };
}
