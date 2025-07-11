import { FastifyRequest, FastifyReply } from "fastify";
import type { BreweryInsert, BreweryUpdate } from "../interfaces/IBrewery";
import BreweryRepository from "../repository/brewery.repository";

export default class BreweryController {
  static async getBreweries(request: FastifyRequest, reply: FastifyReply) {
    const prisma = request.server.prisma;
    const breweryRepository = new BreweryRepository(prisma);

    try {
      const breweries = await breweryRepository.getBreweries();
      reply.send(breweries);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
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
    const breweryRepository = new BreweryRepository(prisma);

    try {
      const brewery = await breweryRepository.getBrewery(id);
      if (!brewery) {
        reply.status(404).send({ clientMessage: "Brewery not found" });
        return;
      }
      reply.send(brewery);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async createBrewery(
    request: FastifyRequest<{ Body: BreweryInsert }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const breweryRepository = new BreweryRepository(prisma);
    try {
      const brewery = await breweryRepository.createBrewery(request.body);
      reply.send(brewery);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error" });
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
    const breweryRepository = new BreweryRepository(prisma);

    try {
      const brewery = await breweryRepository.getBrewery(id);
      if (!brewery) {
        reply.status(404).send({ clientMessage: "Brewery not found" });
        return;
      }

      const breweryUpdated = await breweryRepository.updateBrewery(id, request.body);
      reply.send(breweryUpdated);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
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
    const breweryRepository = new BreweryRepository(prisma);
    try {
      const brewery = await breweryRepository.getBrewery(id);
      if (!brewery) {
        reply.status(404).send({ clientMessage: "Brewery not found" });
        return;
      }

      const deletedBrewery = await breweryRepository.deleteBrewery(id);
      reply.send(deletedBrewery);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
