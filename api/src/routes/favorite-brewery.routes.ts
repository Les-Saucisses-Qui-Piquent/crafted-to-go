import { Prisma, PrismaClient } from "@prisma/client";
import { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";

type FavoriteBreweryInsert = Prisma.favorite_breweryCreateInput;

export default async function (fastify: FastifyInstance) {
  fastify.get("/favorite-breweries", async (_request, response) => {
    const prisma = new PrismaClient();

    try {
      const favoriteBreweries = await prisma.favorite_brewery.findMany();

      response.send(favoriteBreweries);
    } catch (error) {
      fastify.log.error(error);
      response.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  });

  fastify.post(
    "/favorite-breweries",
    async (request: FastifyRequest<{ Body: FavoriteBreweryInsert }>, response) => {
      const prisma = new PrismaClient();

      try {
        const input = request.body;
        const favoriteBrewery = await prisma.favorite_brewery.create({ data: input });

        response.send(favoriteBrewery);
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ message: "Server Error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  fastify.delete(
    "/favorite-breweries/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, response) => {
      const prisma = new PrismaClient();
      const { id } = request.params;

      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid uuid" });
        }
        await prisma.favorite_brewery.delete({
          where: { id: id },
        });

        fastify.log.warn({ id }, "Deleted favorite brewery");
        response.send({ message: "Favorite brewery deleted" });
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ message: "Server Error", error });
      } finally {
        await prisma.$disconnect();
      }
    },
  );
}
