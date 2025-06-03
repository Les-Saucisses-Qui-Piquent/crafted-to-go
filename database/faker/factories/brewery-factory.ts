import { fakerFR as faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";
import type { FakerImplementation } from "./types";

type Brewery = Prisma.breweryCreateInput;

export class BreweryFactory implements FakerImplementation {
  constructor(private readonly dbClient: PrismaClient) {}

  private generate = (addressId: string, breweryOwnerId: string): Brewery => {
    return {
      name: faker.company.name(),
      RIB: faker.finance.accountNumber(),
      siren: faker.finance.accountNumber(),
      address_fk: {
        connect: {
          id: addressId,
        },
      },
      brewery_owner_fk: {
        connect: {
          id: breweryOwnerId,
        },
      },
    };
  };

  private randomBreweryOwnerId = (breweryOwnerIds: string[]) => {
    return breweryOwnerIds[Math.floor(Math.random() * breweryOwnerIds.length)];
  };

  createOne = async (addressId: string, breweryOwnerId: string[]) => {
    const brewery = this.generate(addressId, this.randomBreweryOwnerId(breweryOwnerId));
    const createdBrewery = await this.dbClient.brewery.create({ data: brewery });

    return createdBrewery;
  };

  createMany = async (addressIds: string[], breweryOwnerIds: string[]) => {
    const breweries = await Promise.all(
      addressIds.map((addressId) => this.createOne(addressId, breweryOwnerIds)),
    );

    return breweries;
  };
}
