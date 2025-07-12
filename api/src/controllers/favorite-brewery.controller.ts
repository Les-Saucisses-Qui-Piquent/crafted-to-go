import { FastifyRequest, FastifyReply } from "fastify";
import type { FavoriteBreweryInsert, FavoriteBreweryUpdate } from "../interfaces/IFavoriteBrewery";
import FavoriteBreweryRepository from "../repository/favorite-brewery.repository";
import { validateUUID } from "../../utils";

export default class FavoriteBreweryController {
  static async getFavoriteBreweries(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { userId } = request.params;
    const favoriteBreweryRepository = new FavoriteBreweryRepository(prisma);

    validateUUID(userId, reply);

    try {
      const favoriteBreweries = await favoriteBreweryRepository.getFavoriteBreweries(userId);
      if (!favoriteBreweries.length) {
        reply.status(404).send({ clientMessage: "FavoriteBrewery not found" });
        return;
      }
      reply.send(favoriteBreweries);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async createFavoriteBrewery(
    request: FastifyRequest<{ Body: FavoriteBreweryInsert }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const favoriteBreweryRepository = new FavoriteBreweryRepository(prisma);
    try {
      const favoriteBrewery = await favoriteBreweryRepository.createFavoriteBrewery(request.body);
      reply.send(favoriteBrewery);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async updateFavoriteBrewery(
    request: FastifyRequest<{ Params: { id: string }; Body: FavoriteBreweryUpdate }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    const favoriteBreweryRepository = new FavoriteBreweryRepository(prisma);
    try {
      const favoriteBrewery = await favoriteBreweryRepository.updateFavoriteBrewery(
        id,
        request.body,
      );
      reply.send(favoriteBrewery);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async deleteFavoriteBrewery(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    const favoriteBreweryRepository = new FavoriteBreweryRepository(prisma);
    try {
      const deletedFavoriteBrewery = await favoriteBreweryRepository.deleteFavoriteBrewery(id);
      reply.send(deletedFavoriteBrewery);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
