import {
  UserFactory,
  AddressFactory,
  BeerColorFactory,
  BeerStyleFactory,
  BreweryOwnerFactory,
  BreweryFactory,
  BreweryDetailFactory,
} from "./factories";
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
    const addresses = await addressFaker.createMany(10);
    const addressIds = addresses.map((address) => address.id);

    const breweryOwnerFaker = new BreweryOwnerFactory(dbclient);
    const breweryOwners = await breweryOwnerFaker.createMany(addressIds);
    const breweryOwnerIds = breweryOwners.map((breweryOwner) => breweryOwner.id);

    const breweryFaker = new BreweryFactory(dbclient);
    const breweries = await breweryFaker.createMany(addressIds, breweryOwnerIds);
    const breweryIds = breweries.map((brewery) => brewery.id);

    const breweryDetailFaker = new BreweryDetailFactory(dbclient);
    await breweryDetailFaker.createMany(breweryIds);

    const beerColorFaker = new BeerColorFactory(dbclient);
    await beerColorFaker.createMany(10);

    const beerStyleFaker = new BeerStyleFactory(dbclient);
    await beerStyleFaker.createMany(10);

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
