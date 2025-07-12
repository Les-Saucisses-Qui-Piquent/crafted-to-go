import { describe, it, expect, vi, beforeEach } from "vitest";
import mockedPrisma from "../libs/__mocks__/prisma";
import type { order } from "@prisma/client";
import OrderController from "../src/controllers/order.controller";
import { mockedReply, mockRequest } from "../utils/mock-fastify";
import { OrderInsert, OrderUpdate } from "../src/interfaces/IOrder";

describe("🧾 Order", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve all orders", async () => {
    const testOrders: order[] = [
      {
        id: "order-1",
        user_id: "user-1",
        brewery_id: "brewery-1",
        final_price: 42.5,
        status: "pending",
        pickup_day: new Date("2025-01-01"),
        pickup_time: "12:00",
        created_at: new Date("2025-01-01"),
        updated_at: new Date("2025-01-01"),
        payment_method: null,
      },
    ];
    mockedPrisma.order.findMany.mockResolvedValue(testOrders);
    const request = mockRequest();
    await OrderController.getOrders(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testOrders);
  });

  it("should throw an error with wrong id : invalid uuid", async () => {
    const id = "order-1";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await OrderController.getOrder(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(400);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Invalid uuid" });
  });

  it("should retrieve a specific order", async () => {
    const testOrder: order = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      user_id: "user-1",
      brewery_id: "brewery-1",
      final_price: 42.5,
      status: "pending",
      pickup_day: new Date("2025-01-01"),
      pickup_time: "12:00",
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      payment_method: null,
    };
    mockedPrisma.order.findUnique.mockResolvedValueOnce(testOrder);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await OrderController.getOrder(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testOrder);
  });

  it("should return 404 and clientMessage when order not found", async () => {
    mockedPrisma.order.findUnique.mockResolvedValue(null);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await OrderController.getOrder(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Order not found" });
  });

  it("should create an order", async () => {
    const orderInsert: OrderInsert = {
      user: { connect: { id: "user-1" } },
      brewery: { connect: { id: "brewery-1" } },
      final_price: 42.5,
      status: "pending",
      pickup_day: new Date("2025-01-01"),
      pickup_time: "12:00",
    };

    const insertResponse: order = {
      id: "order-1",
      user_id: "user-1",
      brewery_id: "brewery-1",
      final_price: 42.5,
      status: "pending",
      pickup_day: new Date("2025-01-01"),
      pickup_time: "12:00",
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      payment_method: null,
    };
    mockedPrisma.order.create.mockResolvedValue(insertResponse);

    const request = mockRequest<{ Body: OrderInsert }>({ body: orderInsert });

    await OrderController.createOrder(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(insertResponse);
  });

  it("should update an existing order", async () => {
    const testOrder: order = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      user_id: "user-1",
      brewery_id: "brewery-1",
      final_price: 42.5,
      status: "pending",
      pickup_day: new Date("2025-01-01"),
      pickup_time: "12:00",
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      payment_method: null,
    };

    mockedPrisma.order.findUnique.mockResolvedValue(testOrder);
    mockedPrisma.order.update.mockResolvedValue({ ...testOrder, status: "completed" });

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const payload: OrderUpdate = {
      status: "completed",
    };

    const request = mockRequest<{ Params: { id: string }; Body: OrderUpdate }>({
      params: { id },
      body: payload,
    });

    await OrderController.updateOrder(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith({ ...testOrder, status: "completed" });
  });

  it("should throw an error when updating a non-existing order", async () => {
    mockedPrisma.order.findUnique.mockResolvedValue(null);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const payload: OrderUpdate = {
      status: "completed",
    };

    const request = mockRequest<{ Params: { id: string }; Body: OrderUpdate }>({
      params: { id },
      body: payload,
    });

    await OrderController.updateOrder(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Order not found" });
  });

  it("should delete an order", async () => {
    const testOrder: order = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      user_id: "user-1",
      brewery_id: "brewery-1",
      final_price: 42.5,
      status: "pending",
      pickup_day: new Date("2025-01-01"),
      pickup_time: "12:00",
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      payment_method: null,
    };

    mockedPrisma.order.findUnique.mockResolvedValue(testOrder);
    mockedPrisma.order.delete.mockResolvedValue(testOrder);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await OrderController.deleteOrder(request, mockedReply);
    expect(mockedReply.send).toHaveBeenCalledWith(testOrder);
  });

  it("shouldn't delete a non-existing order", async () => {
    mockedPrisma.order.findUnique.mockResolvedValue(null);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await OrderController.deleteOrder(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Order not found" });
  });
});
