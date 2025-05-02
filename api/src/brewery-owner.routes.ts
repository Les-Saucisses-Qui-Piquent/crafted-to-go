import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

type BreweryOwnerInsert = Prisma.brewery_ownerCreateInput;
type BreweryOwnerUpdate = Prisma.brewery_ownerUpdateInput;

export default async function (fastify: FastifyInstance) {
  fastify.get("/brewery-owners", async (_request, response: FastifyReply) => {
    const prisma = new PrismaClient();
    try {
      const orders = await prisma.brewery_owner.findMany();
      response.send(orders);
    } catch (error) {
      fastify.log.error(error, "Error fetching orders");
      response.status(500).send({ message: "Internal server error" });
    } finally {
      await prisma.$disconnect();
    }
  });

  fastify.get(
    "/brewery-owners/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, response: FastifyReply) => {
      const prisma = new PrismaClient();
      const { id } = request.params;

      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid uuid" });
        }

        const breweryOwner = await prisma.brewery_owner.findUnique({
          where: { id },
        });

        if (!breweryOwner) {
          fastify.log.warn({ id }, "Brewery owner not found");
          response.status(404).send({ message: "Brewery owner not found" });
        } else {
          response.send(breweryOwner);
        }
      } catch (error) {
        fastify.log.error({ error, id }, "Error fetching brewery owner");
        response.status(500).send({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  fastify.post(
    "/brewery-owners",
    async (request: FastifyRequest<{ Body: BreweryOwnerInsert }>, response: FastifyReply) => {
      const prisma = new PrismaClient();
      const breweryOwner = request.body;

      try {
        const newBreweryOwner = await prisma.brewery_owner.create({
          data: breweryOwner,
        });

        response.send(newBreweryOwner);
      } catch (error) {
        fastify.log.error({ error, breweryOwner }, "Error creating brewery owner");
        response.status(500).send({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  fastify.put(
    "/brewery-owners/:id",
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: BreweryOwnerUpdate }>,
      response: FastifyReply,
    ) => {
      const prisma = new PrismaClient();
      const { id } = request.params;
      const valuesToUpdate = request.body;

      try {
        const { success: isIdValid } = z.string().uuid().safeParse(id);
        if (!isIdValid) {
          response.status(400).send({ message: "Invalid uuid" });
        }

        const updatedBreweryOwner = await prisma.brewery_owner.update({
          where: { id },
          data: valuesToUpdate,
        });

        if (!updatedBreweryOwner) {
          fastify.log.warn("Brewery owner not found");
          response.status(404).send({ message: "Brewery owner not found" });
        } else {
          response.send(updatedBreweryOwner);
        }
      } catch (error) {
        fastify.log.error({ error, valuesToUpdate }, "Error updating brewery owner");
        response.status(500).send({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  fastify.delete(
    "/brewery-owners/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, response: FastifyReply) => {
      const prisma = new PrismaClient();
      const { id } = request.params;

      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid uuid" });
        }

        await prisma.brewery_owner.delete({
          where: { id },
        });
        fastify.log.warn({ id }, "Deleted brewery owner");
        response.send({ message: "Brewery owner deleted" });
      } catch (error) {
        fastify.log.error({ error, id }, "Error deleting brewery owner");
        response.status(500).send({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );
}
