import { FastifyRequest, FastifyReply } from "fastify";
import type { BreweryDetailInsert, BreweryDetailUpdate } from "../interfaces/IBreweryDetail";
import BreweryDetailRepository from "../repository/brewery-detail.repository";
import { validateUUID } from "../../utils";

export default class BreweryDetailController {
  static async getBreweryDetails(request: FastifyRequest, reply: FastifyReply) {
    const prisma = request.server.prisma;
    const breweryDetailRepository = new BreweryDetailRepository(prisma);
    try {
      const breweryDetails = await breweryDetailRepository.getBreweryDetails();
      reply.send(breweryDetails);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getBreweryDetail(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    const breweryDetailRepository = new BreweryDetailRepository(prisma);

    validateUUID(id, reply);

    try {
      const breweryDetail = await breweryDetailRepository.getBreweryDetail(id);
      if (!breweryDetail) {
        reply.status(404).send({ clientMessage: "BreweryDetail not found" });
        return;
      }
      reply.send(breweryDetail);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async createBreweryDetail(
    request: FastifyRequest<{ Body: BreweryDetailInsert }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const breweryDetailRepository = new BreweryDetailRepository(prisma);
    try {
      const breweryDetail = await breweryDetailRepository.createBreweryDetail(request.body);
      reply.send(breweryDetail);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async updateBreweryDetail(
    request: FastifyRequest<{ Params: { id: string }; Body: BreweryDetailUpdate }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    const breweryDetailRepository = new BreweryDetailRepository(prisma);

    validateUUID(id, reply);

    try {
      const breweryDetail = await breweryDetailRepository.getBreweryDetail(id);
      if (!breweryDetail) {
        reply.status(404).send({ clientMessage: "BreweryDetail not found" });
        return;
      }
      const breweryDetailUpdated = await breweryDetailRepository.updateBreweryDetail(
        id,
        request.body,
      );
      reply.send(breweryDetailUpdated);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async deleteBreweryDetail(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    const breweryDetailRepository = new BreweryDetailRepository(prisma);

    validateUUID(id, reply);

    try {
      const breweryDetail = await breweryDetailRepository.getBreweryDetail(id);
      if (!breweryDetail) {
        reply.status(404).send({ clientMessage: "BreweryDetail not found" });
        return;
      }
      const deletedBreweryDetail = await breweryDetailRepository.deleteBreweryDetail(id);
      reply.send(deletedBreweryDetail);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
