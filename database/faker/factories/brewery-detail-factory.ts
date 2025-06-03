import { fakerFR as faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";
import type { FakerImplementation } from "./types";

type BreweryDetail = Prisma.brewery_detailCreateInput;

export class BreweryDetailFactory implements FakerImplementation {
  constructor(private readonly dbClient: PrismaClient) {}

  private generate = (breweryId: string): BreweryDetail => {
    return {
      image: faker.image.url(),
      logo: faker.image.url(),
      description: faker.lorem.paragraph(),
      social_link: faker.internet.url(),
      opening_hours: faker.lorem.paragraph(),
      has_taproom: faker.datatype.boolean(),
      taproom_hours: faker.lorem.paragraph(),
      phone_number: faker.phone.number(),
      email: faker.internet.email(),
      brewery_fk: {
        connect: {
          id: breweryId,
        },
      },
    };
  };

  createOne = async (breweryId: string) => {
    const breweryDetail = this.generate(breweryId);
    const createdBreweryDetail = await this.dbClient.brewery_detail.create({
      data: breweryDetail,
    });

    return createdBreweryDetail;
  };

  createMany = async (breweryIds: string[]) => {
    const brewers = await Promise.all(breweryIds.map((breweryId) => this.createOne(breweryId)));

    return brewers;
  };
}
