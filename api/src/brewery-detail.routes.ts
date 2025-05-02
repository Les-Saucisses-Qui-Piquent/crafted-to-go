import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

type BreweryDetailInsert = Prisma.brewery_detailCreateInput;
type BreweryDetailUpdate = Prisma.brewery_detailUpdateInput;

export default async function (fastify: FastifyInstance) {
  fastify.get("/brewery-details", async (_request, response: FastifyReply) => {
    const prisma = new PrismaClient();
    try {
      const orders = await prisma.brewery_detail.findMany();
      response.send(orders);
    } catch (error) {
      fastify.log.error(error, "Error fetching orders");
      response.status(500).send({ message: "Internal server error" });
    } finally {
      await prisma.$disconnect();
    }
  });

  fastify.get(
    "/brewery-details/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, response: FastifyReply) => {
      const prisma = new PrismaClient();
      const { id } = request.params;

      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid uuid" });
        }

        const breweryDetail = await prisma.brewery_detail.findUnique({
          where: { id },
        });

        if (!breweryDetail) {
          fastify.log.warn({ id }, "Brewery detail not found");
          response.status(404).send({ message: "Brewery detail not found" });
        } else {
          response.send(breweryDetail);
        }
      } catch (error) {
        fastify.log.error({ error, id }, "Error fetching brewery detail");
        response.status(500).send({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  fastify.post(
    "/brewery-details",
    async (request: FastifyRequest<{ Body: BreweryDetailInsert }>, response: FastifyReply) => {
      const prisma = new PrismaClient();
      const breweryDetail = request.body;

      try {
        const newBreweryDetail = await prisma.brewery_detail.create({
          data: breweryDetail,
        });

        response.send(newBreweryDetail);
      } catch (error) {
        fastify.log.error({ error, breweryDetail }, "Error creating brewery detail");
        response.status(500).send({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  fastify.put(
    "/brewery-details/:id",
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: BreweryDetailUpdate }>,
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

        const updatedBreweryDetail = await prisma.brewery_detail.update({
          where: { id },
          data: valuesToUpdate,
        });

        if (!updatedBreweryDetail) {
          fastify.log.warn("Brewery detail not found");
          response.status(404).send({ message: "Brewery detail not found" });
        } else {
          response.send(updatedBreweryDetail);
        }
      } catch (error) {
        fastify.log.error({ error, valuesToUpdate }, "Error updating brewery detail");
        response.status(500).send({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  fastify.delete(
    "/brewery-details/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, response: FastifyReply) => {
      const prisma = new PrismaClient();
      const { id } = request.params;

      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid uuid" });
        }

        await prisma.brewery_detail.delete({
          where: { id },
        });
        fastify.log.warn({ id }, "Deleted brewery detail");
        response.send({ message: "Brewery detail deleted" });
      } catch (error) {
        fastify.log.error({ error, id }, "Error deleting brewery detail");
        response.status(500).send({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );
}
