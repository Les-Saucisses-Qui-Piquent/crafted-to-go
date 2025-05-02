import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

type OrderInsert = Prisma.orderCreateInput;
type OrderUpdate = Prisma.orderUpdateInput;

export default async function (fastify: FastifyInstance) {
  fastify.get("/orders", async (_request, response: FastifyReply) => {
    const prisma = new PrismaClient();
    try {
      const orders = await prisma.order.findMany();
      response.send(orders);
    } catch (error) {
      fastify.log.error(error, "Error fetching orders");
      response.status(500).send({ message: "Internal server error" });
    } finally {
      await prisma.$disconnect();
    }
  });

  fastify.get(
    "/orders/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, response: FastifyReply) => {
      const prisma = new PrismaClient();
      const { id } = request.params;

      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid order uuid" });
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
        fastify.log.error({ error, id }, "Error fetching order");
        response.status(500).send({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  fastify.post(
    "/orders",
    async (request: FastifyRequest<{ Body: OrderInsert }>, response: FastifyReply) => {
      const prisma = new PrismaClient();
      const order = request.body;

      try {
        const newOrder = await prisma.order.create({
          data: order,
        });

        response.send(newOrder);
      } catch (error) {
        fastify.log.error({ error, order }, "Error creating order");
        response.status(500).send({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  fastify.put(
    "/orders/:id",
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: OrderUpdate }>,
      response: FastifyReply,
    ) => {
      const prisma = new PrismaClient();
      const { id } = request.params;
      const valuesToUpdate = request.body;

      try {
        const { success: isIdValid } = z.string().uuid().safeParse(id);
        if (!isIdValid) {
          response.status(400).send({ message: "Invalid order uuid" });
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
        fastify.log.error({ error, valuesToUpdate }, "Error updating order");
        response.status(500).send({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  fastify.delete(
    "/orders/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, response: FastifyReply) => {
      const prisma = new PrismaClient();
      const { id } = request.params;

      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid order uuid" });
        }

        await prisma.order.delete({
          where: { id },
        });
        fastify.log.warn({ id }, "Deleted order");
        response.send({ message: "Order deleted" });
      } catch (error) {
        fastify.log.error({ error, id }, "Error deleting order");
        response.status(500).send({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );
}
