import { FastifyRequest, FastifyReply } from "fastify";
import { Prisma } from "@prisma/client";
import { z } from "zod";

type AddressInsert = Prisma.addressCreateInput;
type AddressUpdate = Prisma.addressUpdateInput;

export default class AddressController {
  static async getAddresses(request: FastifyRequest, reply: FastifyReply) {
    const prisma = request.server.prisma;
    try {
      const addresses = await prisma.address.findMany();
      reply.send(addresses);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getAddress(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(id);

      if (!success) {
        reply.status(400).send({ clientMessage: "Invalid uuid" });
      }
      const address = await prisma.address.findUnique({
        where: { id: id },
      });
      if (!address) {
        console.warn({ id }, "Address not found");
        reply.status(404).send({ clientMessage: "Address not found" });
        return;
      }
      reply.send(address);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async createAddress(
    request: FastifyRequest<{ Body: AddressInsert }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    try {
      const input = request.body;
      const address = await prisma.address.create({ data: input });
      reply.send(address);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ clientMessage: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async updateAddress(
    request: FastifyRequest<{ Params: { id: string }; Body: AddressUpdate }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    const data = request.body;
    try {
      const { success } = z.string().uuid().safeParse(id);

      if (!success) {
        reply.status(400).send({ clientMessage: "Invalid uuid" });
      }
      const address = await prisma.address.update({
        where: { id: id },
        data: data,
      });
      if (!address) {
        reply.status(404).send({ clientMessage: "Address not found" });
        return;
      }
      reply.send(address);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async deleteAddress(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(id);

      if (!success) {
        reply.status(400).send({ clientMessage: "Invalid uuid" });
      }
      await prisma.address.delete({
        where: { id: id },
      });
      console.warn({ id }, "Deleted address");
      reply.send({ clientMessage: "Address deleted" });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
