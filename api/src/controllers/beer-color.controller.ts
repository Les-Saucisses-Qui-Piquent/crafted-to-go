import { FastifyRequest, FastifyReply } from "fastify";
import { Prisma } from "@prisma/client";
import { z } from "zod";

type BeerColorInsert = Prisma.beer_colorCreateInput;
type BeerColorUpdate = Prisma.beer_colorUpdateInput;

export default class BeerColorController {
  static async getBeerColors(request: FastifyRequest, reply: FastifyReply) {
    const prisma = request.server.prisma;
    try {
      const beerColors = await prisma.beer_color.findMany();
      reply.send(beerColors);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
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
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ message: "Invalid uuid" });
        return;
      }
      const beerColor = await prisma.beer_color.findUnique({ where: { id } });
      if (!beerColor) {
        reply.status(404).send({ message: "BeerColor not found" });
        return;
      }
      reply.send(beerColor);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async createBeerColor(
    request: FastifyRequest<{ Body: BeerColorInsert }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    try {
      const beerColor = await prisma.beer_color.create({
        data: request.body,
      });
      reply.send(beerColor);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error" });
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
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ message: "Invalid uuid" });
        return;
      }
      const beerColor = await prisma.beer_color.update({
        where: { id },
        data: request.body,
      });
      if (!beerColor) {
        reply.status(404).send({ message: "BeerColor not found" });
        return;
      }
      reply.send(beerColor);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
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
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ message: "Invalid uuid" });
        return;
      }
      await prisma.beer_color.delete({ where: { id } });
      reply.send({ message: "BeerColor deleted" });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
