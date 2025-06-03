import { Prisma, PrismaClient } from "@prisma/client";
import { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";

type AddressInsert = Prisma.addressCreateInput;
type AddressUpdate = Prisma.addressUpdateInput;

export default async function (fastify: FastifyInstance) {
  // Route GET pour récupérer toutes les adresses
  fastify.get("/addresses", async (_request, response) => {
    const prisma = new PrismaClient();
    try {
      const addresses = await prisma.address.findMany();
      response.send(addresses);
    } catch (error) {
      fastify.log.error(error);
      response.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  });

  // Route GET pour récupérer une adresse
  fastify.get(
    "/addresses/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, response) => {
      const prisma = new PrismaClient();
      const { id } = request.params;
      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid uuid" });
        }
        const address = await prisma.address.findUnique({
          where: { id: id },
        });
        if (!address) {
          fastify.log.warn({ id }, "Address not found");
          response.status(404).send({ message: "Address not found" });
          return;
        }
        response.send(address);
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ message: "Server Error", error });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  // Route POST pour ajouter une adresse
  fastify.post("/addresses", async (request: FastifyRequest<{ Body: AddressInsert }>, response) => {
    const prisma = new PrismaClient();
    try {
      const input = request.body;
      const address = await prisma.address.create({ data: input });
      response.send(address);
    } catch (error) {
      fastify.log.error(error);
      response.status(500).send({ message: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  });

  // Route PUT pour modifier une adresse
  fastify.put(
    "/addresses/:id",
    async (request: FastifyRequest<{ Params: { id: string }; Body: AddressUpdate }>, response) => {
      const prisma = new PrismaClient();
      const { id } = request.params;
      const data = request.body;
      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid uuid" });
        }
        const address = await prisma.address.update({
          where: { id: id },
          data: data,
        });
        if (!address) {
          response.status(404).send({ message: "Address not found" });
          return;
        }
        response.send(address);
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ message: "Server Error", error });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  // Route DELETE pour supprimer une adresse
  fastify.delete(
    "/addresses/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, response) => {
      const prisma = new PrismaClient();
      const { id } = request.params;
      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid uuid" });
        }
        await prisma.address.delete({
          where: { id: id },
        });
        fastify.log.warn({ id }, "Deleted address");
        response.send({ message: "Address deleted" });
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ message: "Server Error", error });
      } finally {
        await prisma.$disconnect();
      }
    },
  );
}
