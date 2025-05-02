import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  // Route GET pour récupérer tout les styles de bière
  fastify.get("/beer-styles", async (_request, response) => {
    const prisma = new PrismaClient();
    try {
      const beerStyles = await prisma.beer_style.findMany();
      response.send(beerStyles);
    } catch (error) {
      fastify.log.error(error);
      response.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  });
}
