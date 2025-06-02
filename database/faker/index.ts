import { AddressFactory } from "./address-factory";
import { BeerColorFactory } from "./beer-color-factory";
import { UserFactory } from "./user-factory";
import { PrismaClient } from "@prisma/client";

/* eslint-disable no-console */

const main = async (dbclient: PrismaClient) => {
  if (process.env.NODE_ENV !== "develop") {
    console.log("-== Skipping faker  ==-");
    return;
  }

  console.log("-== Starting faker ==-");
  try {
    const userFaker = new UserFactory(dbclient);
    await userFaker.createMany(10);

    const addressFaker = new AddressFactory(dbclient);
    await addressFaker.createMany(10);

    const beerColorFaker = new BeerColorFactory(dbclient);
    await beerColorFaker.createMany(10);

    console.log("-== Completed fake seeding ==-");
  } catch (error) {
    console.error("/!\\ Error while running faker /!\\");
    console.error(error);
    process.exit(1);
  }
};

const prismaClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

main(prismaClient);
