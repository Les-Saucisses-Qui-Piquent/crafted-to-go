import { FastifyRequest, FastifyReply } from "fastify";
import type { BeerColorInsert, BeerColorUpdate } from "../interfaces/IBeerColor";
import BeerColorRepository from "../repository/beer-color.repository";

export default class BeerColorController {
  static async getBeerColors(request: FastifyRequest, reply: FastifyReply) {
    const prisma = request.server.prisma;
    const beerColorRepository = new BeerColorRepository(prisma);
    try {
      const beerColors = await beerColorRepository.getBeerColors();
      reply.send(beerColors);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getBeerColor(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    const beerColorRepository = new BeerColorRepository(prisma);
    try {
      const beerColor = await beerColorRepository.getBeerColor(id);
      if (!beerColor) {
        reply.status(404).send({ clientMessage: "BeerColor not found" });
        return;
      }
      reply.send(beerColor);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async createBeerColor(
    request: FastifyRequest<{ Body: BeerColorInsert }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const beerColorRepository = new BeerColorRepository(prisma);
    try {
      const beerColor = await beerColorRepository.createBeerColor(request.body);
      reply.send(beerColor);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async updateBeerColor(
    request: FastifyRequest<{ Params: { id: string }; Body: BeerColorUpdate }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    const beerColorRepository = new BeerColorRepository(prisma);
    try {
      const beerColor = await beerColorRepository.getBeerColor(id);
      if (!beerColor) {
        reply.status(404).send({ clientMessage: "BeerColor not found" });
        return;
      }
      const beerColorUpdated = await beerColorRepository.updateBeerColor(id, request.body);
      reply.send(beerColorUpdated);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async deleteBeerColor(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    const beerColorRepository = new BeerColorRepository(prisma);
    try {
      const beerColor = await beerColorRepository.getBeerColor(id);
      if (!beerColor) {
        reply.status(404).send({ clientMessage: "BeerColor not found" });
        return;
      }
      const deletedBeerColor = await beerColorRepository.deleteBeerColor(id);
      reply.send(deletedBeerColor);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
