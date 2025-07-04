import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

export type Table =
  | "test"
  | "brewery"
  | "brewery_detail"
  | "brewery_owner"
  | "favorite_brewery"
  | "favorite_beer"
  | "order"
  | "order_detail"
  | "user"
  | "user_detail"
  | "beer"
  | "beer_color"
  | "beer_style"
  | "address";

const config: Record<Table, () => Promise<any>> = {
  test: async () => {
    return prisma.test.findMany();
  },
  brewery: async () => {
    return prisma.brewery.findMany();
  },
  brewery_detail: async () => {
    return prisma.brewery_detail.findMany();
  },
  brewery_owner: async () => {
    return prisma.brewery_owner.findMany();
  },
  favorite_brewery: async () => {
    return prisma.favorite_brewery.findMany();
  },
  favorite_beer: async () => {
    return prisma.favorite_beer.findMany();
  },
  order: async () => {
    return prisma.order.findMany();
  },
  order_detail: async () => {
    return prisma.order_detail.findMany();
  },
  user: async () => {
    return prisma.user.findMany();
  },
  user_detail: async () => {
    return prisma.user_detail.findMany();
  },
  beer: async () => {
    return prisma.beer.findMany();
  },
  beer_color: async () => {
    return prisma.beer_color.findMany();
  },
  beer_style: async () => {
    return prisma.beer_style.findMany();
  },
  address: async () => {
    return prisma.address.findMany();
  },
};

const dumpData = async (): Promise<void> => {
  const tables = Object.entries(config);

  const tablePromises = tables.map(async ([tableName, queryFn]) => {
    const data = await queryFn();
    return [tableName, data];
  });

  const data = Object.fromEntries(await Promise.all(tablePromises));

  // Write to file
  fs.writeFileSync("./tmp/dump-data.json", JSON.stringify(data, null, 2));
  console.log("-== Dump completed successfully ==-");
};

dumpData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
