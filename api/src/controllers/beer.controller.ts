import { FastifyRequest, FastifyReply } from "fastify";
import type { BeerInsert, BeerUpdate } from "../interfaces/IBeer";
import BeerRepository from "../repository/beer.repository";

export default class BeerController {
  static async getBeers(request: FastifyRequest, reply: FastifyReply) {
    const prisma = request.server.prisma;
    const beerRepository = new BeerRepository(prisma);
    try {
      const beers = await beerRepository.getBeers();
      reply.send(beers);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getBeer(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    const beerRepository = new BeerRepository(prisma);
    try {
      const beer = await beerRepository.getBeer(id);
      if (!beer) {
        reply.status(404).send({ clientMessage: "Beer not found" });
        return;
      }
      reply.send(beer);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async createBeer(request: FastifyRequest<{ Body: BeerInsert }>, reply: FastifyReply) {
    const prisma = request.server.prisma;
    const beerRepository = new BeerRepository(prisma);
    try {
      const beer = await beerRepository.createBeer(request.body);
      reply.send(beer);
    } catch (error) {
      request.server.log.error(error);
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
    const beerRepository = new BeerRepository(prisma);
    try {
      const beer = await beerRepository.getBeer(id);
      if (!beer) {
        reply.status(404).send({ clientMessage: "Beer not found" });
        return;
      }
      const beerUpdated = await beerRepository.updateBeer(id, request.body);
      reply.send(beerUpdated);
    } catch (error) {
      request.server.log.error(error);
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
    const beerRepository = new BeerRepository(prisma);
    try {
      const beer = await beerRepository.getBeer(id);
      if (!beer) {
        reply.status(404).send({ clientMessage: "Beer not found" });
        return;
      }
      const deletedBeer = await beerRepository.deleteBeer(id);
      reply.send(deletedBeer);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
