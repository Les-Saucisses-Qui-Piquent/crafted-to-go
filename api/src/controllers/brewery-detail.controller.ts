import { FastifyRequest, FastifyReply } from "fastify";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

type BreweryDetailInsert = Prisma.brewery_detailCreateInput;
type BreweryDetailUpdate = Prisma.brewery_detailUpdateInput;

export const BreweryDetailController = {
  getBreweryDetails: async (_request: FastifyRequest, reply: FastifyReply) => {
    const prisma = new PrismaClient();
    try {
      const breweryDetails = await prisma.brewery_detail.findMany();
      reply.send(breweryDetails);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  },

  getBreweryDetail: async (
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
      const breweryDetail = await prisma.brewery_detail.findUnique({ where: { id } });
      if (!breweryDetail) {
        reply.status(404).send({ message: "BreweryDetail not found" });
        return;
      }
      reply.send(breweryDetail);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  },

  createBreweryDetail: async (
    request: FastifyRequest<{ Body: BreweryDetailInsert }>,
    reply: FastifyReply,
  ) => {
    const prisma = new PrismaClient();
    try {
      const breweryDetail = await prisma.brewery_detail.create({
        data: request.body,
      });
      reply.send(breweryDetail);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  },

  updateBreweryDetail: async (
    request: FastifyRequest<{ Params: { id: string }; Body: BreweryDetailUpdate }>,
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
      const breweryDetail = await prisma.brewery_detail.update({
        where: { id },
        data: request.body,
      });
      if (!breweryDetail) {
        reply.status(404).send({ message: "BreweryDetail not found" });
        return;
      }
      reply.send(breweryDetail);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  },

  deleteBreweryDetail: async (
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
      await prisma.brewery_detail.delete({ where: { id } });
      reply.send({ message: "BreweryDetail deleted" });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  },
};
