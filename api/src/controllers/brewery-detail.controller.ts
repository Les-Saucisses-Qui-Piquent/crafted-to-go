import { FastifyRequest, FastifyReply } from "fastify";
import { Prisma } from "@prisma/client";
import { z } from "zod";

type BreweryDetailInsert = Prisma.brewery_detailCreateInput;
type BreweryDetailUpdate = Prisma.brewery_detailUpdateInput;

export default class BreweryDetailController {
  static async getBreweryDetails(request: FastifyRequest, reply: FastifyReply) {
    const prisma = request.server.prisma;
    try {
      const breweryDetails = await prisma.brewery_detail.findMany();
      reply.send(breweryDetails);
    } catch (error) {
      console.error(error);
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
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ clientMessage: "Invalid uuid" });
        return;
      }
      const breweryDetail = await prisma.brewery_detail.findUnique({ where: { id } });
      if (!breweryDetail) {
        reply.status(404).send({ clientMessage: "BreweryDetail not found" });
        return;
      }
      reply.send(breweryDetail);
    } catch (error) {
      console.error(error);
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
    try {
      const breweryDetail = await prisma.brewery_detail.create({
        data: request.body,
      });
      reply.send(breweryDetail);
    } catch (error) {
      console.error(error);
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
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ clientMessage: "Invalid uuid" });
        return;
      }
      const breweryDetail = await prisma.brewery_detail.update({
        where: { id },
        data: request.body,
      });
      if (!breweryDetail) {
        reply.status(404).send({ clientMessage: "BreweryDetail not found" });
        return;
      }
      reply.send(breweryDetail);
    } catch (error) {
      console.error(error);
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
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ clientMessage: "Invalid uuid" });
        return;
      }
      await prisma.brewery_detail.delete({ where: { id } });
      reply.send({ clientMessage: "BreweryDetail deleted" });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
