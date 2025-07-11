import { FastifyRequest, FastifyReply } from "fastify";
import { Prisma } from "@prisma/client";
import { z } from "zod";

type FavoriteBeerInsert = Prisma.favorite_beerCreateInput;
type FavoriteBeerUpdate = Prisma.favorite_beerUpdateInput;

export default class FavoriteBeerController {
  static async getFavoriteBeers(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { userId } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(userId);
      if (!success) {
        reply.status(400).send({ clientMessage: "Invalid user ID" });
        return;
      }
      const favoriteBeers = await prisma.favorite_beer.findMany({
        where: { user_id: userId },
      });
      if (!favoriteBeers) {
        reply.status(404).send({ clientMessage: "FavoriteBeers not found" });
        return;
      }
      reply.send(favoriteBeers);
    } catch (error) {
      console.error(error);
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
    try {
      const favoriteBeer = await prisma.favorite_beer.create({
        data: request.body,
      });

      reply.send(favoriteBeer);
    } catch (error) {
      console.error(error);
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
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ clientMessage: "Invalid uuid" });
        return;
      }

      const favoriteBeer = await prisma.favorite_beer.update({
        where: { id },
        data: request.body,
      });

      reply.send(favoriteBeer);
    } catch (error) {
      console.error(error);
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
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ clientMessage: "Invalid uuid" });
        return;
      }
      await prisma.favorite_beer.delete({ where: { id } });

      reply.send({ clientMessage: "FavoriteBeer deleted" });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
