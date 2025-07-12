import { type order_detail, Prisma } from "@prisma/client";

export type OrderDetailInsert = Prisma.order_detailCreateInput;
export type OrderDetailUpdate = Prisma.order_detailUpdateInput;

export interface IOrderDetail {
  getOrderDetails: () => Promise<order_detail[]>;
  getOrderDetail: (id: string) => Promise<order_detail | null>;
  getDetailFromOrder: (orderId: string) => Promise<order_detail[]>;
  createOrderDetail: (payload: OrderDetailInsert) => Promise<order_detail>;
  updateOrderDetail: (id: string, payload: OrderDetailUpdate) => Promise<order_detail>;
  deleteOrderDetail: (id: string) => Promise<order_detail>;
}
