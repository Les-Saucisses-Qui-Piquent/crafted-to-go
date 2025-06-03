import { FastifyRequest, FastifyReply } from "fastify";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

type BeerInsert = Prisma.beerCreateInput;
type BeerUpdate = Prisma.beerUpdateInput;

export const BeerController = {
  getBeers: async (_request: FastifyRequest, reply: FastifyReply) => {
    const prisma = new PrismaClient();
    try {
      const beers = await prisma.beer.findMany();
      reply.send(beers);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  },

  getBeer: async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const prisma = new PrismaClient();
    const { id } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ message: "Invalid uuid" });
        return;
      }
      const beer = await prisma.beer.findUnique({ where: { id } });
      if (!beer) {
        reply.status(404).send({ message: "Beer not found" });
        return;
      }
      reply.send(beer);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  },

  createBeer: async (request: FastifyRequest<{ Body: BeerInsert }>, reply: FastifyReply) => {
    const prisma = new PrismaClient();
    try {
      const beer = await prisma.beer.create({ data: request.body });
      reply.send(beer);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  },

  updateBeer: async (
    request: FastifyRequest<{ Params: { id: string }; Body: BeerUpdate }>,
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
      const beer = await prisma.beer.update({
        where: { id },
        data: request.body,
      });
      if (!beer) {
        reply.status(404).send({ message: "Beer not found" });
        return;
      }
      reply.send(beer);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  },

  deleteBeer: async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const prisma = new PrismaClient();
    const { id } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ message: "Invalid uuid" });
        return;
      }
      await prisma.beer.delete({ where: { id } });
      reply.send({ message: "Beer deleted" });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  },
};
