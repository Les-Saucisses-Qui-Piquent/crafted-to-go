import { FastifyRequest, FastifyReply } from "fastify";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

type OrderDetailInsert = Prisma.order_detailCreateInput;
type OrderDetailUpdate = Prisma.order_detailUpdateInput;

export default class OrderDetailController {
  static async getOrderDetails(_request: FastifyRequest, reply: FastifyReply) {
    const prisma = new PrismaClient();
    try {
      const orderDetails = await prisma.order_detail.findMany();
      reply.send(orderDetails);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getOrderDetail(
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
      const orderDetail = await prisma.order_detail.findUnique({ where: { id } });
      if (!orderDetail) {
        reply.status(404).send({ message: "OrderDetail not found" });
        return;
      }
      reply.send(orderDetail);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getDetailFromOrder(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = new PrismaClient();
    const { id: orderId } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(orderId);
      if (!success) {
        reply.status(400).send({ message: "Invalid uuid" });
        return;
      }

      const orderDetails = await prisma.order_detail.findMany({
        where: { order_id: orderId },
      });
      if (!orderDetails) {
        reply.status(404).send({ message: "OrderDetail not found" });
        return;
      }

      reply.send(orderDetails);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async createOrderDetail(
    request: FastifyRequest<{ Body: OrderDetailInsert }>,
    reply: FastifyReply,
  ) {
    const prisma = new PrismaClient();
    try {
      const orderDetail = await prisma.order_detail.create({
        data: request.body,
      });
      reply.send(orderDetail);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async updateOrderDetail(
    request: FastifyRequest<{ Params: { id: string }; Body: OrderDetailUpdate }>,
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
      const orderDetail = await prisma.order_detail.update({
        where: { id },
        data: request.body,
      });
      if (!orderDetail) {
        reply.status(404).send({ message: "OrderDetail not found" });
        return;
      }
      reply.send(orderDetail);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async deleteOrderDetail(
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
      await prisma.order_detail.delete({ where: { id } });
      reply.send({ message: "OrderDetail deleted" });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
