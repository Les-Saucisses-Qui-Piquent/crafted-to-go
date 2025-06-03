import { Prisma, PrismaClient } from "@prisma/client";
import { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";

type FavoriteBeerInsert = Prisma.favorite_beerCreateInput;

export default async function (fastify: FastifyInstance) {
  fastify.get("/favorite-beers", async (_request, response) => {
    const prisma = new PrismaClient();

    try {
      const favoriteBeers = await prisma.favorite_beer.findMany();

      response.send(favoriteBeers);
    } catch (error) {
      fastify.log.error(error);
      response.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  });

  fastify.post(
    "/favorite-beers",
    async (request: FastifyRequest<{ Body: FavoriteBeerInsert }>, response) => {
      const prisma = new PrismaClient();

      try {
        const input = request.body;
        const favoriteBeer = await prisma.favorite_beer.create({ data: input });

        response.send(favoriteBeer);
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ message: "Server Error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  fastify.delete(
    "/favorite-beers/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, response) => {
      const prisma = new PrismaClient();
      const { id } = request.params;

      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid uuid" });
        }
        await prisma.favorite_beer.delete({
          where: { id: id },
        });

        fastify.log.warn({ id }, "Deleted favorite beer");
        response.send({ message: "Favorite beer deleted" });
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ message: "Server Error", error });
      } finally {
        await prisma.$disconnect();
      }
    },
  );
}
