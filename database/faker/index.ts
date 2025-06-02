import { UserFactory } from "./user-factory";
import { PrismaClient } from "@prisma/client";

const main = async (dbclient: PrismaClient) => {
  console.log("-== Starting faker ==-");

  const userFaker = new UserFactory(dbclient);

  await userFaker.createMany(10);
};

const prismaClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

main(prismaClient);
