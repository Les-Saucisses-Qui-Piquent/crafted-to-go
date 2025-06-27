import { fakerFR as faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";
import type { FakerImplementation } from "./types";

type BreweryDetail = Prisma.brewery_detailCreateInput;

type Day = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
type DayDetail = {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};
type JsonHours = Record<Day, DayDetail>;

export class BreweryDetailFactory implements FakerImplementation {
  constructor(private readonly dbClient: PrismaClient) {}

  private generate = (breweryId: string): BreweryDetail => {
    const getRandomTime = () => {
      const hours = faker.number.int({ min: 0, max: 12 });
      const minutes = faker.number.int({ min: 0, max: 59 });
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    };

    const openingHours: JsonHours = {
      monday: {
        isOpen: faker.datatype.boolean(),
        openTime: getRandomTime(),
        closeTime: getRandomTime(),
      },
      tuesday: {
        isOpen: faker.datatype.boolean(),
        openTime: getRandomTime(),
        closeTime: getRandomTime(),
      },
      wednesday: {
        isOpen: faker.datatype.boolean(),
        openTime: getRandomTime(),
        closeTime: getRandomTime(),
      },
      thursday: {
        isOpen: faker.datatype.boolean(),
        openTime: getRandomTime(),
        closeTime: getRandomTime(),
      },
      friday: {
        isOpen: faker.datatype.boolean(),
        openTime: getRandomTime(),
        closeTime: getRandomTime(),
      },
      saturday: {
        isOpen: faker.datatype.boolean(),
        openTime: getRandomTime(),
        closeTime: getRandomTime(),
      },
      sunday: {
        isOpen: faker.datatype.boolean(),
        openTime: getRandomTime(),
        closeTime: getRandomTime(),
      },
    };

    return {
      image: faker.image.url(),
      logo: faker.image.url(),
      description: faker.lorem.paragraph(),
      social_links: [faker.internet.url(), faker.internet.url()],
      opening_hours: openingHours,
      has_taproom: faker.datatype.boolean(),
      taproom_hours: openingHours,
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
