import { FastifyRequest, FastifyReply } from "fastify";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

type BreweryOwnerInsert = Prisma.brewery_ownerCreateInput;
type BreweryOwnerUpdate = Prisma.brewery_ownerUpdateInput;

export const BreweryOwnerController = {
  getBreweryOwners: async (_request: FastifyRequest, reply: FastifyReply) => {
    const prisma = new PrismaClient();
    try {
      const breweryOwners = await prisma.brewery_owner.findMany();
      reply.send(breweryOwners);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  },

  getBreweryOwner: async (
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
      const breweryOwner = await prisma.brewery_owner.findUnique({ where: { id } });
      if (!breweryOwner) {
        reply.status(404).send({ message: "BreweryOwner not found" });
        return;
      }
      reply.send(breweryOwner);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  },

  createBreweryOwner: async (
    request: FastifyRequest<{ Body: BreweryOwnerInsert }>,
    reply: FastifyReply,
  ) => {
    const prisma = new PrismaClient();
    try {
      const breweryOwner = await prisma.brewery_owner.create({
        data: request.body,
      });
      reply.send(breweryOwner);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  },

  updateBreweryOwner: async (
    request: FastifyRequest<{ Params: { id: string }; Body: BreweryOwnerUpdate }>,
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
      const breweryOwner = await prisma.brewery_owner.update({
        where: { id },
        data: request.body,
      });
      if (!breweryOwner) {
        reply.status(404).send({ message: "BreweryOwner not found" });
        return;
      }
      reply.send(breweryOwner);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  },

  deleteBreweryOwner: async (
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
      await prisma.brewery_owner.delete({ where: { id } });
      reply.send({ message: "BreweryOwner deleted" });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  },
};
