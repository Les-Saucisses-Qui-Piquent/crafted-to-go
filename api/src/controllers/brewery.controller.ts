import { FastifyRequest, FastifyReply } from "fastify";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

type BreweryInsert = Prisma.breweryCreateInput;
type BreweryUpdate = Prisma.breweryUpdateInput;

export const BreweryController = {
  getBreweries: async (_request: FastifyRequest, reply: FastifyReply) => {
    const prisma = new PrismaClient();
    try {
      const breweries = await prisma.brewery.findMany();
      reply.send(breweries);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  },

  getBrewery: async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const prisma = new PrismaClient();
    const { id } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ message: "Invalid uuid" });
        return;
      }
      const brewery = await prisma.brewery.findUnique({ where: { id } });
      if (!brewery) {
        reply.status(404).send({ message: "Brewery not found" });
        return;
      }
      reply.send(brewery);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  },

  createBrewery: async (request: FastifyRequest<{ Body: BreweryInsert }>, reply: FastifyReply) => {
    const prisma = new PrismaClient();
    try {
      const brewery = await prisma.brewery.create({
        data: request.body,
      });
      reply.send(brewery);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  },

  updateBrewery: async (
    request: FastifyRequest<{ Params: { id: string }; Body: BreweryUpdate }>,
    reply: FastifyReply,
  ) => {
    const prisma = new PrismaClient();
    const { id } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ message: "Invalid uuid" });
        return;
      }
      const brewery = await prisma.brewery.update({
        where: { id },
        data: request.body,
      });
      if (!brewery) {
        reply.status(404).send({ message: "Brewery not found" });
        return;
      }
      reply.send(brewery);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  },

  deleteBrewery: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const prisma = new PrismaClient();
    const { id } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ message: "Invalid uuid" });
        return;
      }
      await prisma.brewery.delete({ where: { id } });
      reply.send({ message: "Brewery deleted" });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  },
};
