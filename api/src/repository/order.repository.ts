import type { PrismaClient } from "@prisma/client";
import type { IOrder, OrderInsert, OrderUpdate } from "../interfaces/IOrder";
import z from "zod";

export default class OrderRepository implements IOrder {
  constructor(private prisma: PrismaClient) {}

  getOrders = async () => {
    return await this.prisma.order.findMany();
  };

  getOrder = async (id: string) => {
    const { success, error } = z.string().uuid().safeParse(id);
    if (!success) {
      throw new Error(error.message);
    }
    return await this.prisma.order.findUnique({ where: { id } });
  };

  createOrder = async (payload: OrderInsert) => {
    return await this.prisma.order.create({ data: payload });
  };

  updateOrder = async (id: string, payload: OrderUpdate) => {
    const { success, error } = z.string().uuid().safeParse(id);
    if (!success) {
      throw new Error(error.message);
    }
    return await this.prisma.order.update({ where: { id }, data: payload });
  };

  deleteOrder = async (id: string) => {
    const { success, error } = z.string().uuid().safeParse(id);
    if (!success) {
      throw new Error(error.message);
    }
    return await this.prisma.order.delete({ where: { id } });
  };
}
