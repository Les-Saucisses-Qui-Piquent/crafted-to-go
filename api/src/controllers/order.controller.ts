import { FastifyRequest, FastifyReply } from "fastify";
import type { OrderInsert, OrderUpdate } from "../interfaces/IOrder";
import OrderRepository from "../repository/order.repository";

export default class OrderController {
  static async getOrders(request: FastifyRequest, reply: FastifyReply) {
    const prisma = request.server.prisma;
    const orderRepository = new OrderRepository(prisma);
    try {
      const orders = await orderRepository.getOrders();
      reply.send(orders);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getOrder(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    const orderRepository = new OrderRepository(prisma);
    try {
      const order = await orderRepository.getOrder(id);
      if (!order) {
        reply.status(404).send({ clientMessage: "Order not found" });
        return;
      }
      reply.send(order);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async createOrder(request: FastifyRequest<{ Body: OrderInsert }>, reply: FastifyReply) {
    const prisma = request.server.prisma;
    const orderRepository = new OrderRepository(prisma);
    try {
      const order = await orderRepository.createOrder(request.body);
      reply.send(order);
    } catch (error) {
      request.server.log.error(error);
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
    const orderRepository = new OrderRepository(prisma);
    try {
      const order = await orderRepository.getOrder(id);
      if (!order) {
        reply.status(404).send({ clientMessage: "Order not found" });
        return;
      }
      const orderUpdated = await orderRepository.updateOrder(id, request.body);
      reply.send(orderUpdated);
    } catch (error) {
      request.server.log.error(error);
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
    const orderRepository = new OrderRepository(prisma);
    try {
      const order = await orderRepository.getOrder(id);
      if (!order) {
        reply.status(404).send({ clientMessage: "Order not found" });
        return;
      }
      const deletedOrder = await orderRepository.deleteOrder(id);
      reply.send(deletedOrder);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
