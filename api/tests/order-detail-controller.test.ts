import { describe, it, expect, vi, beforeEach } from "vitest";
import mockedPrisma from "../libs/__mocks__/prisma";
import type { order_detail } from "@prisma/client";
import OrderDetailController from "../src/controllers/order-detail.controller";
import { mockedReply, mockRequest } from "../utils/mock-fastify";
import { OrderDetailInsert, OrderDetailUpdate } from "../src/interfaces/IOrderDetail";

describe("📦 OrderDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve all order details", async () => {
    const testDetails: order_detail[] = [
      {
        id: "detail-1",
        order_id: "order-1",
        beer_id: "beer-1",
        quantity: 2,
        price: 10.5,
        is_ready: false,
        created_at: new Date("2025-01-01"),
        updated_at: new Date("2025-01-01"),
      },
    ];
    mockedPrisma.order_detail.findMany.mockResolvedValue(testDetails);
    const request = mockRequest();

    await OrderDetailController.getOrderDetails(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testDetails);
  });

  it("should throw an error with wrong id : invalid uuid", async () => {
    const id = "detail-1";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await OrderDetailController.getOrderDetail(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(400);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Invalid uuid" });
  });

  it("should retrieve a specific order detail", async () => {
    const testDetail: order_detail = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      order_id: "order-1",
      beer_id: "beer-1",
      quantity: 2,
      price: 10.5,
      is_ready: false,
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
    };
    mockedPrisma.order_detail.findUnique.mockResolvedValueOnce(testDetail);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await OrderDetailController.getOrderDetail(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testDetail);
  });

  it("should return 404 and clientMessage when order detail not found", async () => {
    mockedPrisma.order_detail.findUnique.mockResolvedValue(null);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await OrderDetailController.getOrderDetail(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "OrderDetail not found" });
  });

  it("should throw an error with wrong orderId : invalid uuid", async () => {
    const orderId = "order-1";
    const request = mockRequest<{ Params: { orderId: string } }>({ params: { orderId } });

    await OrderDetailController.getDetailFromOrder(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(400);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Invalid uuid" });
  });

  it("should retrieve details from order", async () => {
    const testDetails: order_detail[] = [
      {
        id: "detail-1",
        order_id: "123e4567-e89b-12d3-a456-426614174000",
        beer_id: "beer-1",
        quantity: 2,
        price: 10.5,
        is_ready: false,
        created_at: new Date("2025-01-01"),
        updated_at: new Date("2025-01-01"),
      },
    ];
    mockedPrisma.order_detail.findMany.mockResolvedValueOnce(testDetails);

    const orderId = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { orderId: string } }>({ params: { orderId } });

    await OrderDetailController.getDetailFromOrder(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testDetails);
  });

  it("should return 404 and clientMessage when order details from order not found", async () => {
    mockedPrisma.order_detail.findMany.mockResolvedValueOnce([]);

    const orderId = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { orderId: string } }>({ params: { orderId } });

    await OrderDetailController.getDetailFromOrder(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "OrderDetail not found" });
  });

  it("should create an order detail", async () => {
    const detailInsert: OrderDetailInsert = {
      order: { connect: { id: "order-1" } },
      beer: { connect: { id: "beer-1" } },
      quantity: 2,
      price: 10.5,
    };

    const insertResponse: order_detail = {
      id: "detail-1",
      order_id: "order-1",
      beer_id: "beer-1",
      quantity: 2,
      price: 10.5,
      is_ready: false,
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
    };
    mockedPrisma.order_detail.create.mockResolvedValue(insertResponse);

    const request = mockRequest<{ Body: OrderDetailInsert }>({ body: detailInsert });

    await OrderDetailController.createOrderDetail(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(insertResponse);
  });

  it("should update an existing order detail", async () => {
    const testDetail: order_detail = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      order_id: "order-1",
      beer_id: "beer-1",
      quantity: 2,
      price: 10.5,
      is_ready: false,
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
    };

    mockedPrisma.order_detail.findUnique.mockResolvedValue(testDetail);
    mockedPrisma.order_detail.update.mockResolvedValue({ ...testDetail, is_ready: true });

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const payload: OrderDetailUpdate = {
      is_ready: true,
    };

    const request = mockRequest<{ Params: { id: string }; Body: OrderDetailUpdate }>({
      params: { id },
      body: payload,
    });

    await OrderDetailController.updateOrderDetail(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith({ ...testDetail, is_ready: true });
  });

  it("should throw an error when updating a non-existing order detail", async () => {
    mockedPrisma.order_detail.findUnique.mockResolvedValue(null);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const payload: OrderDetailUpdate = {
      is_ready: true,
    };

    const request = mockRequest<{ Params: { id: string }; Body: OrderDetailUpdate }>({
      params: { id },
      body: payload,
    });

    await OrderDetailController.updateOrderDetail(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "OrderDetail not found" });
  });

  it("should delete an order detail", async () => {
    const testDetail: order_detail = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      order_id: "order-1",
      beer_id: "beer-1",
      quantity: 2,
      price: 10.5,
      is_ready: false,
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
    };

    mockedPrisma.order_detail.findUnique.mockResolvedValue(testDetail);
    mockedPrisma.order_detail.delete.mockResolvedValue(testDetail);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await OrderDetailController.deleteOrderDetail(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testDetail);
  });

  it("shouldn't delete a non-existing order detail", async () => {
    mockedPrisma.order_detail.findUnique.mockResolvedValue(null);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await OrderDetailController.deleteOrderDetail(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "OrderDetail not found" });
  });
});
