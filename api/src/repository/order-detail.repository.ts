import type { PrismaClient } from "@prisma/client";
import type {
  IOrderDetail,
  OrderDetailInsert,
  OrderDetailUpdate,
} from "../interfaces/IOrderDetail";
import z from "zod";

export default class OrderDetailRepository implements IOrderDetail {
  constructor(private prisma: PrismaClient) {}

  getOrderDetails = async () => {
    return await this.prisma.order_detail.findMany();
  };

  getOrderDetail = async (id: string) => {
    const { success, error } = z.string().uuid().safeParse(id);
    if (!success) {
      throw new Error(error.message);
    }
    return await this.prisma.order_detail.findUnique({ where: { id } });
  };

  getDetailFromOrder = async (orderId: string) => {
    const { success, error } = z.string().uuid().safeParse(orderId);
    if (!success) {
      throw new Error(error.message);
    }
    return await this.prisma.order_detail.findMany({ where: { order_id: orderId } });
  };

  createOrderDetail = async (payload: OrderDetailInsert) => {
    return await this.prisma.order_detail.create({ data: payload });
  };

  updateOrderDetail = async (id: string, payload: OrderDetailUpdate) => {
    const { success, error } = z.string().uuid().safeParse(id);
    if (!success) {
      throw new Error(error.message);
    }
    return await this.prisma.order_detail.update({ where: { id }, data: payload });
  };

  deleteOrderDetail = async (id: string) => {
    const { success, error } = z.string().uuid().safeParse(id);
    if (!success) {
      throw new Error(error.message);
    }
    return await this.prisma.order_detail.delete({ where: { id } });
  };
}
