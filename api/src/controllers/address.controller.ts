import { FastifyRequest, FastifyReply } from "fastify";
import type { AddressInsert, AddressUpdate } from "../interfaces/IAddress";
import AddressRepository from "../repository/address.repository";

export default class AddressController {
  static async getAddresses(request: FastifyRequest, reply: FastifyReply) {
    const prisma = request.server.prisma;
    const addressRepository = new AddressRepository(prisma);
    try {
      const addresses = await addressRepository.getAddresses();
      reply.send(addresses);
    } catch (error) {
      request.server.log.error(error);
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
    const addressRepository = new AddressRepository(prisma);
    try {
      const address = await addressRepository.getAddress(id);
      if (!address) {
        reply.status(404).send({ clientMessage: "Address not found" });
        return;
      }
      reply.send(address);
    } catch (error) {
      request.server.log.error(error);
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
    const addressRepository = new AddressRepository(prisma);
    try {
      const address = await addressRepository.createAddress(request.body);
      reply.send(address);
    } catch (error) {
      request.server.log.error(error);
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
    const addressRepository = new AddressRepository(prisma);
    try {
      const address = await addressRepository.getAddress(id);
      if (!address) {
        reply.status(404).send({ clientMessage: "Address not found" });
        return;
      }
      const addressUpdated = await addressRepository.updateAddress(id, request.body);
      reply.send(addressUpdated);
    } catch (error) {
      request.server.log.error(error);
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
    const addressRepository = new AddressRepository(prisma);
    try {
      const address = await addressRepository.getAddress(id);
      if (!address) {
        reply.status(404).send({ clientMessage: "Address not found" });
        return;
      }
      const deletedAddress = await addressRepository.deleteAddress(id);
      reply.send(deletedAddress);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
