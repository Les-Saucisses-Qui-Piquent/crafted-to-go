import { fakerFR as faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";
import type { FakerImplementation } from "./types";

type BeerColor = Prisma.beer_colorCreateInput;

export class BeerColorFactory implements FakerImplementation {
  constructor(private readonly dbClient: PrismaClient) {}

  private generate = (): BeerColor => {
    return {
      label: faker.color.human(),
      beer_levels: [faker.number.int({ min: 1, max: 3 })],
    };
  };

  createOne = async () => {
    const beerColor = this.generate();
    const createdBeerColor = await this.dbClient.beer_color.create({ data: beerColor });

    return createdBeerColor;
  };

  createMany = async (count: number) => {
    const beerColors = Array.from({ length: count }, () => this.generate());
    const createdBeerColors = await this.dbClient.beer_color.createMany({ data: beerColors });

    return createdBeerColors;
  };
}
