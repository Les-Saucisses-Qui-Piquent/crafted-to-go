import { FastifyRequest, FastifyReply } from "fastify";
import { Prisma } from "@prisma/client";
import { z } from "zod";

type BeerInsert = Prisma.beerCreateInput;
type BeerUpdate = Prisma.beerUpdateInput;

export default class BeerController {
  static async getBeers(request: FastifyRequest, reply: FastifyReply) {
    const prisma = request.server.prisma;
    try {
      const beers = await prisma.beer.findMany();
      reply.send(beers);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getBeer(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ clientMessage: "Invalid uuid" });
        return;
      }
      const beer = await prisma.beer.findUnique({ where: { id } });
      if (!beer) {
        reply.status(404).send({ clientMessage: "Beer not found" });
        return;
      }
      reply.send(beer);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async createBeer(request: FastifyRequest<{ Body: BeerInsert }>, reply: FastifyReply) {
    const prisma = request.server.prisma;
    try {
      const beer = await prisma.beer.create({ data: request.body });
      reply.send(beer);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ clientMessage: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async updateBeer(
    request: FastifyRequest<{ Params: { id: string }; Body: BeerUpdate }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ clientMessage: "Invalid uuid" });
        return;
      }
      const beer = await prisma.beer.update({
        where: { id },
        data: request.body,
      });
      if (!beer) {
        reply.status(404).send({ clientMessage: "Beer not found" });
        return;
      }
      reply.send(beer);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async deleteBeer(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ clientMessage: "Invalid uuid" });
        return;
      }
      await prisma.beer.delete({ where: { id } });
      reply.send({ clientMessage: "Beer deleted" });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
