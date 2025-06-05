import { FastifyRequest, FastifyReply } from "fastify";
import { Prisma } from "@prisma/client";
import { z } from "zod";

type BreweryInsert = Prisma.breweryCreateInput;
type BreweryUpdate = Prisma.breweryUpdateInput;

export default class BreweryController {
  static async getBreweries(request: FastifyRequest, reply: FastifyReply) {
    const prisma = request.server.prisma;
    try {
      const breweries = await prisma.brewery.findMany();
      reply.send(breweries);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getBrewery(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
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
  }

  static async createBrewery(
    request: FastifyRequest<{ Body: BreweryInsert }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
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
  }

  static async updateBrewery(
    request: FastifyRequest<{ Params: { id: string }; Body: BreweryUpdate }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
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
  }

  static async deleteBrewery(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
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
  }
}
