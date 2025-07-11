import { FastifyRequest, FastifyReply } from "fastify";
import type { BeerStyleInsert, BeerStyleUpdate } from "../interfaces/IBeerStyle";
import BeerStyleRepository from "../repository/beer-style.repository";

export default class BeerStyleController {
  static async getBeerStyles(request: FastifyRequest, reply: FastifyReply) {
    const prisma = request.server.prisma;
    const beerStyleRepository = new BeerStyleRepository(prisma);
    try {
      const beerStyles = await beerStyleRepository.getBeerStyles();
      reply.send(beerStyles);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getBeerStyle(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    const beerStyleRepository = new BeerStyleRepository(prisma);
    try {
      const beerStyle = await beerStyleRepository.getBeerStyle(id);
      if (!beerStyle) {
        reply.status(404).send({ clientMessage: "BeerStyle not found" });
        return;
      }
      reply.send(beerStyle);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async createBeerStyle(
    request: FastifyRequest<{ Body: BeerStyleInsert }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const beerStyleRepository = new BeerStyleRepository(prisma);
    try {
      const beerStyle = await beerStyleRepository.createBeerStyle(request.body);
      reply.send(beerStyle);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async updateBeerStyle(
    request: FastifyRequest<{ Params: { id: string }; Body: BeerStyleUpdate }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    const beerStyleRepository = new BeerStyleRepository(prisma);
    try {
      const beerStyle = await beerStyleRepository.getBeerStyle(id);
      if (!beerStyle) {
        reply.status(404).send({ clientMessage: "BeerStyle not found" });
        return;
      }
      const beerStyleUpdated = await beerStyleRepository.updateBeerStyle(id, request.body);
      reply.send(beerStyleUpdated);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async deleteBeerStyle(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    const beerStyleRepository = new BeerStyleRepository(prisma);
    try {
      const beerStyle = await beerStyleRepository.getBeerStyle(id);
      if (!beerStyle) {
        reply.status(404).send({ clientMessage: "BeerStyle not found" });
        return;
      }
      const deletedBeerStyle = await beerStyleRepository.deleteBeerStyle(id);
      reply.send(deletedBeerStyle);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
