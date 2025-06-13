import { fakerFR as faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";
import type { FakerImplementation } from "./types";

type Address = Prisma.addressCreateInput;

export class AddressFactory implements FakerImplementation {
  constructor(private readonly dbClient: PrismaClient) {}

  private generate = (): Address => {
    return {
      line_1: faker.location.streetAddress(),
      line_2: faker.location.secondaryAddress(),
      postal_code: faker.location.zipCode(),
      city: faker.location.city(),
      country: faker.location.country(),
    };
  };

  createOne = async () => {
    const address = this.generate();
    const createdAddress = await this.dbClient.address.create({ data: address });

    return createdAddress;
  };

  createMany = async (count: number) => {
    const addresses = await Promise.all(Array.from({ length: count }, () => this.createOne()));

    return addresses;
  };
}
