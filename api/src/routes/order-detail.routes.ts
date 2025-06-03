import { FastifyInstance } from "fastify";
import OrderDetailController from "../controllers/order-detail.controller";

export default async function (fastify: FastifyInstance) {
  fastify.get("/order-details", {
    handler: OrderDetailController.getOrderDetails,
  });

  fastify.get("/order-details/:id", {
    handler: OrderDetailController.getOrderDetail,
  });

  fastify.get("/order-details/:orderId", {
    handler: OrderDetailController.getDetailFromOrder,
  });

  fastify.post("/order-details", {
    handler: OrderDetailController.createOrderDetail,
  });

  fastify.put("/order-details/:id", {
    handler: OrderDetailController.updateOrderDetail,
  });

  fastify.delete("/order-details/:id", {
    handler: OrderDetailController.deleteOrderDetail,
  });
}
