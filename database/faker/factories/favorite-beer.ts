import { fakerFR as faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";
import type { FakerImplementation } from "./types";

type FavoriteBeer = Prisma.favorite_beerCreateInput;

export class FavoriteBeerFactory implements FakerImplementation {
  constructor(private readonly dbClient: PrismaClient) {}

  private generate = (beerId: string, userId: string): FavoriteBeer => {
    return {
      beer_fk: {
        connect: {
          id: beerId,
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

  createOne = async (beerId: string, userId: string) => {
    const favoriteBeer = this.generate(beerId, userId);
    const createdFavoriteBeer = await this.dbClient.favorite_beer.create({ data: favoriteBeer });

    return createdFavoriteBeer;
  };

  createMany = async (beerIds: string[], userIds: string[]) => {
    const favoriteBeers = await Promise.all(
      beerIds.map((beerId) => {
        const userId = this.randomId(userIds);
        return this.createOne(beerId, userId);
      }),
    );

    return favoriteBeers;
  };
}
