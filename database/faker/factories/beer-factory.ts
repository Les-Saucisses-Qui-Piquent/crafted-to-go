import { fakerFR as faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";
import type { FakerImplementation } from "./types";

type Beer = Prisma.beerCreateInput;

export class BeerFactory implements FakerImplementation {
  constructor(private readonly dbClient: PrismaClient) {}

  private generate = (beerColorId: string, breweryId: string, beerStyleId: string): Beer => {
    return {
      name: faker.food.dish(),
      image: faker.image.url(),
      beer_color_fk: {
        connect: {
          id: beerColorId,
        },
      },
      brewery_fk: {
        connect: {
          id: breweryId,
        },
      },
      abv_rate: faker.number.float({ min: 0.0, max: 10.0, fractionDigits: 2 }),
      ibu_rate: faker.number.float({ min: 0.0, max: 10.0, fractionDigits: 2 }),
      quantity: faker.number.int({ max: 100 }),
      price: faker.number.float({ min: 0.0, max: 10.0, fractionDigits: 2 }),
      style_fk: {
        connect: {
          id: beerStyleId,
        },
      },
    };
  };

  private randomId = (ids: string[]) => {
    return ids[Math.floor(Math.random() * ids.length)];
  };

  createOne = async (beerColorId: string, breweryId: string, beerStyleId: string) => {
    const beer = this.generate(beerColorId, breweryId, beerStyleId);
    const createdBeer = await this.dbClient.beer.create({ data: beer });

    return createdBeer;
  };

  createMany = async (beerColorIds: string[], breweryIds: string[], beerStyleIds: string[]) => {
    const beers = await Promise.all(
      beerStyleIds.map((beerStyleId) => {
        const breweryId = this.randomId(breweryIds);
        const colorId = this.randomId(beerColorIds);
        return this.createOne(colorId, breweryId, beerStyleId);
      }),
    );

    return beers;
  };
}
