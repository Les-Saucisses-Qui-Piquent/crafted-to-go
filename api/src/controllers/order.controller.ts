import { FastifyRequest, FastifyReply } from "fastify";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

type OrderInsert = Prisma.orderCreateInput;
type OrderUpdate = Prisma.orderUpdateInput;

export default class OrderController {
  static async getOrders(_request: FastifyRequest, reply: FastifyReply) {
    const prisma = new PrismaClient();
    try {
      const orders = await prisma.order.findMany();
      reply.send(orders);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getOrder(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const prisma = new PrismaClient();
    const { id } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ message: "Invalid uuid" });
        return;
      }
      const order = await prisma.order.findUnique({ where: { id } });
      if (!order) {
        reply.status(404).send({ message: "Order not found" });
        return;
      }
      reply.send(order);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async createOrder(request: FastifyRequest<{ Body: OrderInsert }>, reply: FastifyReply) {
    const prisma = new PrismaClient();
    try {
      const order = await prisma.order.create({ data: request.body });
      reply.send(order);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async updateOrder(
    request: FastifyRequest<{ Params: { id: string }; Body: OrderUpdate }>,
    reply: FastifyReply,
  ) {
    const prisma = new PrismaClient();
    const { id } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ message: "Invalid uuid" });
        return;
      }
      const order = await prisma.order.update({
        where: { id },
        data: request.body,
      });
      if (!order) {
        reply.status(404).send({ message: "Order not found" });
        return;
      }
      reply.send(order);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async deleteOrder(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = new PrismaClient();
    const { id } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ message: "Invalid uuid" });
        return;
      }
      await prisma.order.delete({ where: { id } });
      reply.send({ message: "Order deleted" });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
