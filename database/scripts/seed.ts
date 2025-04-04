import { PrismaClient, Prisma } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();
const seedData = JSON.parse(fs.readFileSync("./tmp/dump-data.json", "utf-8"));

type CreateInputTypes = {
  user: Prisma.userCreateInput;
  user_detail: Prisma.user_detailCreateInput;
  beer: Prisma.beerCreateInput;
  beer_color: Prisma.beer_colorCreateInput;
  beer_style: Prisma.beer_styleCreateInput;
  beer_beer_style: Prisma.beer_beer_styleCreateInput;
  brewery: Prisma.breweryCreateInput;
  brewery_detail: Prisma.brewery_detailCreateInput;
  brewery_owner: Prisma.brewery_ownerCreateInput;
  favorite_brewery: Prisma.favorite_breweryCreateInput;
  favorite_beer: Prisma.favorite_beerCreateInput;
  order: Prisma.orderCreateInput;
  order_detail: Prisma.order_detailCreateInput;
};

const seed = async (): Promise<void> => {
  const tablesData = Object.entries(seedData);

  try {
    for (const [table, data] of tablesData) {
      const model = prisma[table as keyof typeof prisma];

      console.log(`➡️ Seeding ${table}: ${seedData[table].length} items`);

      for (const item of data as CreateInputTypes[keyof CreateInputTypes][]) {
        const typedItem = item as CreateInputTypes[keyof CreateInputTypes];
        await (model as any).create({ data: typedItem });
      }
    }
  } catch (error) {
    console.error(`Error seeding:`, error);
  }
};

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
