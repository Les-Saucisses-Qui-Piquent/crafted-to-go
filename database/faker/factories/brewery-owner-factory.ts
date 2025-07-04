import { Prisma, PrismaClient } from "@prisma/client";
import type { FakerImplementation } from "./types";

type BreweryOwner = Prisma.brewery_ownerCreateInput;

export class BreweryOwnerFactory implements FakerImplementation {
  constructor(private readonly dbClient: PrismaClient) {}

  private generate = (userId: string, addressId: string): BreweryOwner => {
    return {
      user_fk: {
        connect: {
          id: userId,
        },
      },
      address_fk: {
        connect: {
          id: addressId,
        },
      },
    };
  };

  private randomUserId = (userIds: string[]) => {
    return userIds[Math.floor(Math.random() * userIds.length)];
  };

  createOne = async (userId: string, addressId: string) => {
    const breweryOwner = this.generate(userId, addressId);
    const createdBreweryOwner = await this.dbClient.brewery_owner.create({ data: breweryOwner });

    return createdBreweryOwner;
  };

  createMany = async (userIds: string[], addressIds: string[]) => {
    const possibleUserIds = [...userIds];
    const brewers = [];

    for (const addressId of addressIds) {
      const randomUserId = possibleUserIds[Math.floor(Math.random() * possibleUserIds.length)];

      const breweryOwner = await this.createOne(randomUserId, addressId);
      brewers.push(breweryOwner);

      possibleUserIds.splice(possibleUserIds.indexOf(randomUserId), 1);
    }

    return brewers;
  };
}
