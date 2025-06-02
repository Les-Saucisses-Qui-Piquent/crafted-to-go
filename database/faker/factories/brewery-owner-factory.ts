import { fakerFR as faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";
import type { FakerImplementation } from "./types";

type BreweryOwner = Prisma.brewery_ownerCreateInput;

export class BreweryOwnerFactory implements FakerImplementation {
  constructor(private readonly dbClient: PrismaClient) {}

  private generate = (addressId: string): BreweryOwner => {
    return {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      birth_date: faker.date.birthdate(),
      phone_number: faker.phone.number(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      address_fk: {
        connect: {
          id: addressId,
        },
      },
    };
  };

  createOne = async (addressId: string) => {
    const breweryOwner = this.generate(addressId);
    const createdBreweryOwner = await this.dbClient.brewery_owner.create({ data: breweryOwner });

    return createdBreweryOwner;
  };

  createMany = async (addressIds: string[]) => {
    const brewers = await Promise.all(addressIds.map((addressId) => this.createOne(addressId)));

    return brewers;
  };
}
