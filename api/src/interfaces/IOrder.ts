import { type order, Prisma } from "@prisma/client";

export type OrderInsert = Prisma.orderCreateInput;
export type OrderUpdate = Prisma.orderUpdateInput;

export interface IOrder {
  getOrders: () => Promise<order[]>;
  getOrder: (id: string) => Promise<order | null>;
  createOrder: (payload: OrderInsert) => Promise<order>;
  updateOrder: (id: string, payload: OrderUpdate) => Promise<order>;
  deleteOrder: (id: string) => Promise<order>;
}
