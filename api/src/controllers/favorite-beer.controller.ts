import { FastifyRequest, FastifyReply } from "fastify";
import type { FavoriteBeerInsert, FavoriteBeerUpdate } from "../interfaces/IFavoriteBeer";
import FavoriteBeerRepository from "../repository/favorite-beer.repository";

export default class FavoriteBeerController {
  static async getFavoriteBeers(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { userId } = request.params;
    const favoriteBeerRepository = new FavoriteBeerRepository(prisma);
    try {
      const favoriteBeers = await favoriteBeerRepository.getFavoriteBeers(userId);
      if (!favoriteBeers) {
        reply.status(404).send({ clientMessage: "FavoriteBeers not found" });
        return;
      }
      reply.send(favoriteBeers);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async createFavoriteBeer(
    request: FastifyRequest<{ Body: FavoriteBeerInsert }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const favoriteBeerRepository = new FavoriteBeerRepository(prisma);
    try {
      const favoriteBeer = await favoriteBeerRepository.createFavoriteBeer(request.body);
      reply.send(favoriteBeer);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async updateFavoriteBeer(
    request: FastifyRequest<{ Params: { id: string }; Body: FavoriteBeerUpdate }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    const favoriteBeerRepository = new FavoriteBeerRepository(prisma);
    try {
      const favoriteBeerUpdated = await favoriteBeerRepository.updateFavoriteBeer(id, request.body);
      reply.send(favoriteBeerUpdated);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async deleteFavoriteBeer(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    const favoriteBeerRepository = new FavoriteBeerRepository(prisma);
    try {
      const deletedFavoriteBeer = await favoriteBeerRepository.deleteFavoriteBeer(id);
      reply.send(deletedFavoriteBeer);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
