import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  // Route GET pour récupérer tout les couleurs de bière
  fastify.get("/beer-colors", async (_request, response) => {
    const prisma = new PrismaClient();
    try {
      const beerColors = await prisma.beer_color.findMany();
      response.send(beerColors);
    } catch (error) {
      fastify.log.error(error);
      response.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  });
}
