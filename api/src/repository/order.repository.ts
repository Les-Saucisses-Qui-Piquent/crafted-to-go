import type { PrismaClient } from "@prisma/client";
import type { IOrder, OrderInsert, OrderUpdate } from "../interfaces/IOrder";

export default class OrderRepository implements IOrder {
  constructor(private prisma: PrismaClient) {}

  getOrders = async () => {
    return await this.prisma.order.findMany();
  };

  getOrder = async (id: string) => {
    return await this.prisma.order.findUnique({ where: { id } });
  };

  getOrdersFromUser = async (userId: string) => {
    return await this.prisma.order.findMany({ where: { user_id: userId } });
  };

  createOrder = async (payload: OrderInsert) => {
    return await this.prisma.order.create({ data: payload });
  };

  updateOrder = async (id: string, payload: OrderUpdate) => {
    return await this.prisma.order.update({ where: { id }, data: payload });
  };

  deleteOrder = async (id: string) => {
    return await this.prisma.order.delete({ where: { id } });
  };
}
