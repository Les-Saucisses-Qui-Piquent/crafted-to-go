import { FastifyRequest, FastifyReply } from "fastify";
import { Prisma } from "@prisma/client";
import { z } from "zod";

type OrderInsert = Prisma.orderCreateInput;
type OrderUpdate = Prisma.orderUpdateInput;

export default class OrderController {
  static async getOrders(request: FastifyRequest, reply: FastifyReply) {
    const prisma = request.server.prisma;
    try {
      const orders = await prisma.order.findMany();
      reply.send(orders);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getOrder(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ clientMessage: "Invalid uuid" });
        return;
      }
      const order = await prisma.order.findUnique({ where: { id } });
      if (!order) {
        reply.status(404).send({ clientMessage: "Order not found" });
        return;
      }
      reply.send(order);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async createOrder(request: FastifyRequest<{ Body: OrderInsert }>, reply: FastifyReply) {
    const prisma = request.server.prisma;
    try {
      const order = await prisma.order.create({ data: request.body });
      reply.send(order);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ clientMessage: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async updateOrder(
    request: FastifyRequest<{ Params: { id: string }; Body: OrderUpdate }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ clientMessage: "Invalid uuid" });
        return;
      }
      const order = await prisma.order.update({
        where: { id },
        data: request.body,
      });
      if (!order) {
        reply.status(404).send({ clientMessage: "Order not found" });
        return;
      }
      reply.send(order);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async deleteOrder(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ clientMessage: "Invalid uuid" });
        return;
      }
      await prisma.order.delete({ where: { id } });
      reply.send({ clientMessage: "Order deleted" });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
