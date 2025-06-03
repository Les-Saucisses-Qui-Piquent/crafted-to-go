import { Prisma, PrismaClient } from "@prisma/client";
import { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";

type BreweryInsert = Prisma.breweryCreateInput;
type BreweryUpdate = Prisma.breweryUpdateInput;

export default async function (fastify: FastifyInstance) {
  // Route GET pour récupérer toutes les brasseries
  fastify.get("/breweries", async (_request, response) => {
    const prisma = new PrismaClient();
    try {
      const breweries = await prisma.brewery.findMany();
      response.send(breweries);
    } catch (error) {
      fastify.log.error(error);
      response.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  });

  // Route GET pour récupérer une brasserie
  fastify.get(
    "/breweries/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, response) => {
      const prisma = new PrismaClient();
      const { id } = request.params;
      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid uuid" });
        }
        const brewery = await prisma.brewery.findUnique({
          where: { id: id },
        });
        if (!brewery) {
          fastify.log.warn({ id }, "Brewery not found");
          response.status(404).send({ message: "Brewery not found" });
          return;
        }
        response.send(brewery);
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ message: "Server Error", error });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  // Route POST pour ajouter une brasserie
  fastify.post("/breweries", async (request: FastifyRequest<{ Body: BreweryInsert }>, response) => {
    const prisma = new PrismaClient();
    try {
      const input = request.body;
      const brewery = await prisma.brewery.create({ data: input });
      response.send(brewery);
    } catch (error) {
      fastify.log.error(error);
      response.status(500).send({ message: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  });

  // Route PUT pour modifier une brasserie
  fastify.put(
    "/breweries/:id",
    async (request: FastifyRequest<{ Params: { id: string }; Body: BreweryUpdate }>, response) => {
      const prisma = new PrismaClient();
      const { id } = request.params;
      const data = request.body;
      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid uuid" });
        }
        const brewery = await prisma.brewery.update({
          where: { id: id },
          data: data,
        });
        if (!brewery) {
          response.status(404).send({ message: "Brewery not found" });
          return;
        }
        response.send(brewery);
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ message: "Server Error", error });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  // Route DELETE pour supprimer une brasserie
  fastify.delete(
    "/breweries/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, response) => {
      const prisma = new PrismaClient();
      const { id } = request.params;
      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid uuid" });
        }
        await prisma.brewery.delete({
          where: { id: id },
        });
        fastify.log.warn({ id }, "Deleted brewery");
        response.send({ message: "Brewery deleted" });
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ message: "Server Error", error });
      } finally {
        await prisma.$disconnect();
      }
    },
  );
}
