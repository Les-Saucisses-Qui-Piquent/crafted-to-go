import {
  UserFactory,
  AddressFactory,
  BeerColorFactory,
  BeerStyleFactory,
  BreweryOwnerFactory,
  BreweryFactory,
  BreweryDetailFactory,
  BeerFactory,
  FavoriteBeerFactory,
  FavoriteBreweryFactory,
  UserDetailFactory,
  OrderFactory,
  OrderDetailFactory,
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
    const users = await userFaker.createMany(10);
    const userIds = users.map((user) => user.id);

    const userFactory = new UserFactory(dbclient);
    await userFactory.createAdmin();

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
    const beerColors = await beerColorFaker.createMany(10);
    const beerColorIds = beerColors.map((color) => color.id);

    const beerStyleFaker = new BeerStyleFactory(dbclient);
    const beerStyles = await beerStyleFaker.createMany(10);
    const beerStyleIds = beerStyles.map((style) => style.id);

    const beerFaker = new BeerFactory(dbclient);
    const beers = await beerFaker.createMany(beerColorIds, breweryIds, beerStyleIds);
    const beerIds = beers.map((beer) => beer.id);

    const favoriteBeerFaker = new FavoriteBeerFactory(dbclient);
    await favoriteBeerFaker.createMany(beerIds, userIds);

    const favoriteBreweryFaker = new FavoriteBreweryFactory(dbclient);
    await favoriteBreweryFaker.createMany(breweryIds, userIds);

    const userDetailFaker = new UserDetailFactory(dbclient);
    await userDetailFaker.createMany(userIds, addressIds);

    const orderFaker = new OrderFactory(dbclient);
    const orders = await orderFaker.createMany(userIds, breweryIds);
    const orderIds = orders.map((order) => order.id);

    const orderDetailFaker = new OrderDetailFactory(dbclient);
    await orderDetailFaker.createMany(orderIds, beerIds);

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
