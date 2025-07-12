import { FastifyRequest, FastifyReply } from "fastify";
import type { OrderDetailInsert, OrderDetailUpdate } from "../interfaces/IOrderDetail";
import OrderDetailRepository from "../repository/order-detail.repository";

export default class OrderDetailController {
  static async getOrderDetails(request: FastifyRequest, reply: FastifyReply) {
    const prisma = request.server.prisma;
    const orderDetailRepository = new OrderDetailRepository(prisma);
    try {
      const orderDetails = await orderDetailRepository.getOrderDetails();
      reply.send(orderDetails);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getOrderDetail(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    const orderDetailRepository = new OrderDetailRepository(prisma);
    try {
      const orderDetail = await orderDetailRepository.getOrderDetail(id);
      if (!orderDetail) {
        reply.status(404).send({ clientMessage: "OrderDetail not found" });
        return;
      }
      reply.send(orderDetail);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getDetailFromOrder(
    request: FastifyRequest<{ Params: { orderId: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { orderId } = request.params;
    const orderDetailRepository = new OrderDetailRepository(prisma);
    try {
      const orderDetails = await orderDetailRepository.getDetailFromOrder(orderId);
      if (!orderDetails) {
        reply.status(404).send({ clientMessage: "OrderDetail not found" });
        return;
      }
      reply.send(orderDetails);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async createOrderDetail(
    request: FastifyRequest<{ Body: OrderDetailInsert }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const orderDetailRepository = new OrderDetailRepository(prisma);
    try {
      const orderDetail = await orderDetailRepository.createOrderDetail(request.body);
      reply.send(orderDetail);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async updateOrderDetail(
    request: FastifyRequest<{ Params: { id: string }; Body: OrderDetailUpdate }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    const orderDetailRepository = new OrderDetailRepository(prisma);
    try {
      const orderDetail = await orderDetailRepository.getOrderDetail(id);
      if (!orderDetail) {
        reply.status(404).send({ clientMessage: "OrderDetail not found" });
        return;
      }
      const orderDetailUpdated = await orderDetailRepository.updateOrderDetail(id, request.body);
      reply.send(orderDetailUpdated);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async deleteOrderDetail(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    const orderDetailRepository = new OrderDetailRepository(prisma);
    try {
      const orderDetail = await orderDetailRepository.getOrderDetail(id);
      if (!orderDetail) {
        reply.status(404).send({ clientMessage: "OrderDetail not found" });
        return;
      }
      const deletedOrderDetail = await orderDetailRepository.deleteOrderDetail(id);
      reply.send(deletedOrderDetail);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
