import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";


export default class BreweryOwnerController {
  static async getBreweryOwners(request: FastifyRequest, reply: FastifyReply) {
    const prisma = request.server.prisma;
    try {
      const breweryOwners = await prisma.brewery_owner.findMany();
      reply.send(breweryOwners);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getBreweryOwner(
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
      const breweryOwner = await prisma.user.findUnique({
        where: { id },
        include: {
          brewery_owner: true,
        },
      });
      if (!breweryOwner) {
        reply.status(404).send({ message: "BreweryOwner not found" });
        return;
      }
      reply.send(breweryOwner);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
