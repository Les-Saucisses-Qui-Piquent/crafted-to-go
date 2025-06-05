import { FastifyRequest, FastifyReply } from "fastify";
import { Prisma } from "@prisma/client";
import { z } from "zod";

type FavoriteBreweryInsert = Prisma.favorite_breweryCreateInput;
type FavoriteBreweryUpdate = Prisma.favorite_breweryUpdateInput;

export default class FavoriteBreweryController {
  static async getFavoriteBreweries(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { userId } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(userId);
      if (!success) {
        reply.status(400).send({ message: "Invalid uuid" });
        return;
      }

      const favoriteBreweries = await prisma.favorite_brewery.findMany({
        where: { user_id: userId },
      });

      if (!favoriteBreweries) {
        reply.status(404).send({ message: "FavoriteBrewery not found" });
        return;
      }

      reply.send(favoriteBreweries);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async createFavoriteBrewery(
    request: FastifyRequest<{ Body: FavoriteBreweryInsert }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    try {
      const favoriteBrewery = await prisma.favorite_brewery.create({
        data: request.body,
      });
      reply.send(favoriteBrewery);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error" });
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
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ message: "Invalid uuid" });
        return;
      }
      const favoriteBrewery = await prisma.favorite_brewery.update({
        where: { id },
        data: request.body,
      });
      if (!favoriteBrewery) {
        reply.status(404).send({ message: "FavoriteBrewery not found" });
        return;
      }
      reply.send(favoriteBrewery);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
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
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ message: "Invalid uuid" });
        return;
      }
      await prisma.favorite_brewery.delete({ where: { id } });
      reply.send({ message: "FavoriteBrewery deleted" });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
