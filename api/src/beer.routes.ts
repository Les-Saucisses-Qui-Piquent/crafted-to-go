import { Prisma, PrismaClient } from "@prisma/client";
import { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";

type BeerInsert = Prisma.beerCreateInput;
type BeerUpdate = Prisma.beerUpdateInput;

export default async function (fastify: FastifyInstance) {
  // Route GET pour récupérer toutes les bières
  fastify.get("/beers", async (_request, response) => {
    const prisma = new PrismaClient();
    try {
      const beers = await prisma.beer.findMany();
      response.send(beers);
    } catch (error) {
      fastify.log.error(error);
      response.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  });

  // Route GET pour récupérer une bière
  fastify.get(
    "/beers/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, response) => {
      const prisma = new PrismaClient();
      const { id } = request.params;
      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid uuid" });
        }
        const beer = await prisma.beer.findUnique({
          where: { id: id },
        });
        if (!beer) {
          fastify.log.warn({ id }, "Beer not found");
          response.status(404).send({ message: "Beer not found" });
          return;
        }
        response.send(beer);
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ message: "Server Error", error });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  // Route POST pour ajouter une bière
  fastify.post("/beers", async (request: FastifyRequest<{ Body: BeerInsert }>, response) => {
    const prisma = new PrismaClient();
    try {
      const input = request.body;
      const beer = await prisma.beer.create({ data: input });
      response.send(beer);
    } catch (error) {
      fastify.log.error(error);
      response.status(500).send({ message: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  });

  // Route PUT pour modifier une bière
  fastify.put(
    "/beers/:id",
    async (request: FastifyRequest<{ Params: { id: string }; Body: BeerUpdate }>, response) => {
      const prisma = new PrismaClient();
      const { id } = request.params;
      const data = request.body;
      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid uuid" });
        }
        const beer = await prisma.beer.update({
          where: { id: id },
          data: data,
        });
        if (!beer) {
          response.status(404).send({ message: "Beer not found" });
          return;
        }
        response.send(beer);
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ message: "Server Error", error });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  // Route DELETE pour supprimer une bière
  fastify.delete(
    "/beers/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, response) => {
      const prisma = new PrismaClient();
      const { id } = request.params;
      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid uuid" });
        }
        await prisma.beer.delete({
          where: { id: id },
        });
        fastify.log.warn({ id }, "Deleted beer");
        response.send({ message: "Beer deleted" });
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ message: "Server Error", error });
      } finally {
        await prisma.$disconnect();
      }
    },
  );
}
