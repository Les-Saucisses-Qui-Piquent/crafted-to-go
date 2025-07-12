import type { PrismaClient } from "@prisma/client";
import type {
  IOrderDetail,
  OrderDetailInsert,
  OrderDetailUpdate,
} from "../interfaces/IOrderDetail";

export default class OrderDetailRepository implements IOrderDetail {
  constructor(private prisma: PrismaClient) {}

  getOrderDetails = async () => {
    return await this.prisma.order_detail.findMany();
  };

  getOrderDetail = async (id: string) => {
    return await this.prisma.order_detail.findUnique({ where: { id } });
  };

  getDetailFromOrder = async (orderId: string) => {
    return await this.prisma.order_detail.findMany({ where: { order_id: orderId } });
  };

  createOrderDetail = async (payload: OrderDetailInsert) => {
    return await this.prisma.order_detail.create({ data: payload });
  };

  updateOrderDetail = async (id: string, payload: OrderDetailUpdate) => {
    return await this.prisma.order_detail.update({ where: { id }, data: payload });
  };

  deleteOrderDetail = async (id: string) => {
    return await this.prisma.order_detail.delete({ where: { id } });
  };
}
