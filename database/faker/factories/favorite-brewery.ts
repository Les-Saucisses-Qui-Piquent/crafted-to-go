import { fakerFR as faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";
import type { FakerImplementation } from "./types";

type FavoriteBrewery = Prisma.favorite_breweryCreateInput;

export class FavoriteBreweryFactory implements FakerImplementation {
  constructor(private readonly dbClient: PrismaClient) {}

  private generate = (breweryId: string, userId: string): FavoriteBrewery => {
    return {
      brewery_fk: {
        connect: {
          id: breweryId,
        },
      },
      user_fk: {
        connect: {
          id: userId,
        },
      },
      liked_at: faker.date.anytime(),
    };
  };

  private randomId = (ids: string[]) => {
    return ids[Math.floor(Math.random() * ids.length)];
  };

  createOne = async (breweryId: string, userId: string) => {
    const favoriteBrewery = this.generate(breweryId, userId);
    const createdFavoriteBrewery = await this.dbClient.favorite_brewery.create({
      data: favoriteBrewery,
    });

    return createdFavoriteBrewery;
  };

  createMany = async (breweryIds: string[], userIds: string[]) => {
    const favoriteBrewerys = await Promise.all(
      breweryIds.map((breweryId) => {
        const userId = this.randomId(userIds);
        return this.createOne(breweryId, userId);
      }),
    );

    return favoriteBrewerys;
  };
}
