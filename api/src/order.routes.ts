import { FastifyInstance, FastifyRequest } from "fastify";
import { Prisma, PrismaClient } from "@prisma/client";

type Order = Prisma.orderCreateInput;

export default async function (fastify: FastifyInstance) {
  fastify.get("/orders", async (_request, response) => {
    const prisma = new PrismaClient();
    try {
      const orders = await prisma.order.findMany();
      response.send(orders);
    } catch (error) {
      console.error(error);
      response.status(500).send({ message: "Internal server error" });
    } finally {
      prisma.$disconnect();
    }
  });

  fastify.get(
    "/order/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, response) => {
      const prisma = new PrismaClient();
      const { id } = request.params;

      if (!id) {
        response.status(400).send({ message: "Order ID is required" });
        return;
      }

      const order = await prisma.order.findUnique({
        where: { id },
      });

      if (!order) {
        response.status(404).send({ message: "Order not found" });
      } else {
        response.send(order);
      }
      prisma.$disconnect();
    },
  );

  fastify.post("/order", async (request: FastifyRequest<{ Body: Order }>, response) => {
    const prisma = new PrismaClient();

    const order = request.body;

    const newOrder = await prisma.order.create({
      data: {
        order,
      },
    });
    response.send(newOrder);
  });
}
