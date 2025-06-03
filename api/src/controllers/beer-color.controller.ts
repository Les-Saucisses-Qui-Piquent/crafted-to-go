import { FastifyRequest, FastifyReply } from "fastify";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

type BeerColorInsert = Prisma.beer_colorCreateInput;
type BeerColorUpdate = Prisma.beer_colorUpdateInput;

export const BeerColorController = {
  getBeerColors: async (_request: FastifyRequest, reply: FastifyReply) => {
    const prisma = new PrismaClient();
    try {
      const beerColors = await prisma.beer_color.findMany();
      reply.send(beerColors);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  },

  getBeerColor: async (
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
      const beerColor = await prisma.beer_color.findUnique({ where: { id } });
      if (!beerColor) {
        reply.status(404).send({ message: "BeerColor not found" });
        return;
      }
      reply.send(beerColor);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  },

  createBeerColor: async (
    request: FastifyRequest<{ Body: BeerColorInsert }>,
    reply: FastifyReply,
  ) => {
    const prisma = new PrismaClient();
    try {
      const beerColor = await prisma.beer_color.create({
        data: request.body,
      });
      reply.send(beerColor);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  },

  updateBeerColor: async (
    request: FastifyRequest<{ Params: { id: string }; Body: BeerColorUpdate }>,
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
      const beerColor = await prisma.beer_color.update({
        where: { id },
        data: request.body,
      });
      if (!beerColor) {
        reply.status(404).send({ message: "BeerColor not found" });
        return;
      }
      reply.send(beerColor);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  },

  deleteBeerColor: async (
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
      await prisma.beer_color.delete({ where: { id } });
      reply.send({ message: "BeerColor deleted" });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  },
};
