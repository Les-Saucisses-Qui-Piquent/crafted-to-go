import { FastifyRequest, FastifyReply } from "fastify";
import { Prisma } from "@prisma/client";
import { z } from "zod";

type BeerStyleInsert = Prisma.beer_styleCreateInput;
type BeerStyleUpdate = Prisma.beer_styleUpdateInput;

export default class BeerStyleController {
  static async getBeerStyles(request: FastifyRequest, reply: FastifyReply) {
    const prisma = request.server.prisma;
    try {
      const beerStyles = await prisma.beer_style.findMany();
      reply.send(beerStyles);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
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
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ message: "Invalid uuid" });
        return;
      }
      const beerStyle = await prisma.beer_style.findUnique({ where: { id } });
      if (!beerStyle) {
        reply.status(404).send({ message: "BeerStyle not found" });
        return;
      }
      reply.send(beerStyle);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async createBeerStyle(
    request: FastifyRequest<{ Body: BeerStyleInsert }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    try {
      const beerStyle = await prisma.beer_style.create({
        data: request.body,
      });
      reply.send(beerStyle);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error" });
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
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ message: "Invalid uuid" });
        return;
      }
      const beerStyle = await prisma.beer_style.update({
        where: { id },
        data: request.body,
      });
      if (!beerStyle) {
        reply.status(404).send({ message: "BeerStyle not found" });
        return;
      }
      reply.send(beerStyle);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
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
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ message: "Invalid uuid" });
        return;
      }
      await prisma.beer_style.delete({ where: { id } });
      reply.send({ message: "BeerStyle deleted" });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
