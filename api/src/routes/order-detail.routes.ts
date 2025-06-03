import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

type OrderDetailInsert = Prisma.order_detailCreateInput;
type OrderDetailUpdate = Prisma.order_detailUpdateInput;

export default async function (fastify: FastifyInstance) {
  fastify.get("/order-details", async (_request, response: FastifyReply) => {
    const prisma = new PrismaClient();
    try {
      const orderDetails = await prisma.order_detail.findMany();
      response.send(orderDetails);
    } catch (error) {
      fastify.log.error(error, "Error fetching order details");
      response.status(500).send({ message: "Internal server error" });
    } finally {
      await prisma.$disconnect();
    }
  });

  fastify.get(
    "/order-details/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, response: FastifyReply) => {
      const prisma = new PrismaClient();
      const { id } = request.params;

      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid uuid" });
        }

        const orderDetail = await prisma.order_detail.findUnique({
          where: { id },
        });

        if (!orderDetail) {
          fastify.log.warn({ id }, "Order detail not found");
          response.status(404).send({ message: "Order detail not found" });
        } else {
          response.send(orderDetail);
        }
      } catch (error) {
        fastify.log.error({ error, id }, "Error fetching order detail");
        response.status(500).send({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  fastify.post(
    "/order-details",
    async (request: FastifyRequest<{ Body: OrderDetailInsert }>, response: FastifyReply) => {
      const prisma = new PrismaClient();
      const orderDetail = request.body;

      try {
        const newOrderDetail = await prisma.order_detail.create({
          data: orderDetail,
        });

        response.send(newOrderDetail);
      } catch (error) {
        fastify.log.error({ error, orderDetail }, "Error creating order detail");
        response.status(500).send({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  fastify.put(
    "/order-details/:id",
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: OrderDetailUpdate }>,
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

        const updatedOrderDetail = await prisma.order_detail.update({
          where: { id },
          data: valuesToUpdate,
        });

        if (!updatedOrderDetail) {
          fastify.log.warn("Order detail not found");
          response.status(404).send({ message: "Order detail not found" });
        } else {
          response.send(updatedOrderDetail);
        }
      } catch (error) {
        fastify.log.error({ error, valuesToUpdate }, "Error updating order detail");
        response.status(500).send({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  fastify.delete(
    "/order-details/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, response: FastifyReply) => {
      const prisma = new PrismaClient();
      const { id } = request.params;

      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid uuid" });
        }

        await prisma.order_detail.delete({
          where: { id },
        });
        fastify.log.warn({ id }, "Deleted order detail");
        response.send({ message: "Order detail deleted" });
      } catch (error) {
        fastify.log.error({ error, id }, "Error deleting order detail");
        response.status(500).send({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );
}
