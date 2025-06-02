import { fakerFR as faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";
import type { FakerImplementation } from "./types";

type BeerStyle = Prisma.beer_styleCreateInput;

export class BeerStyleFactory implements FakerImplementation {
  constructor(private readonly dbClient: PrismaClient) {}

  private generate = (): BeerStyle => {
    return {
      label: faker.lorem.word(),
      beer_levels: [faker.number.int({ min: 1, max: 3 })],
    };
  };

  createOne = async () => {
    const beerStyle = this.generate();
    const createdBeerStyle = await this.dbClient.beer_style.create({ data: beerStyle });

    return createdBeerStyle;
  };

  createMany = async (count: number) => {
    const beerStyles = Array.from({ length: count }, () => this.generate());
    const createdBeerStyles = await this.dbClient.beer_style.createMany({ data: beerStyles });

    return createdBeerStyles;
  };
}
