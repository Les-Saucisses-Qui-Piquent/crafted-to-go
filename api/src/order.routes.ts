import { FastifyInstance, FastifyRequest } from "fastify";
import { Prisma, PrismaClient } from "@prisma/client";

type OrderInsert = Prisma.orderCreateInput;
type OrderUpdate = Prisma.orderUpdateInput;

export default async function (fastify: FastifyInstance) {
  fastify.get("/orders", async (_request, response) => {
    const prisma = new PrismaClient();
    try {
      const orders = await prisma.order.findMany();
      response.send(orders);
    } catch (error) {
      fastify.log.error(error);
      response.status(500).send({ message: "Internal server error" });
    } finally {
      prisma.$disconnect();
    }
  });

  fastify.get(
    "/orders/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, response) => {
      const prisma = new PrismaClient();
      try {
        const { id } = request.params;

        if (!id) {
          response.status(400).send({ message: "Order ID is required" });
          return;
        }

        const order = await prisma.order.findUnique({
          where: { id },
        });

        if (!order) {
          fastify.log.warn({ id }, "Order not found");
          response.status(404).send({ message: "Order not found" });
        } else {
          response.send(order);
        }
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ message: "Internal server error" });
      } finally {
        prisma.$disconnect();
      }
    },
  );

  fastify.post("/orders", async (request: FastifyRequest<{ Body: OrderInsert }>, response) => {
    const prisma = new PrismaClient();

    try {
      const order = request.body;

      const newOrder = await prisma.order.create({
        data: order,
      });

      response.send(newOrder);
    } catch (error) {
      fastify.log.error(error);
      response.status(500).send({ message: "Internal server error" });
    } finally {
      prisma.$disconnect();
    }
  });

  fastify.put(
    "/orders/:id",
    async (request: FastifyRequest<{ Params: { id: string }; Body: OrderUpdate }>, response) => {
      const prisma = new PrismaClient();
      try {
        const { id } = request.params;
        const valuesToUpdate = request.body;

        if (!id) {
          response.status(400).send({ message: "Order ID is required" });
          return;
        }

        const updatedOrder = await prisma.order.update({
          where: { id },
          data: valuesToUpdate,
        });

        if (!updatedOrder) {
          fastify.log.warn("Order not found");
          response.status(404).send({ message: "Order not found" });
        } else {
          response.send(updatedOrder);
        }
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ message: "Internal server error" });
      } finally {
        prisma.$disconnect();
      }
    },
  );
}
