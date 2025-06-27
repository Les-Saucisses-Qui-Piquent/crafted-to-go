import { FastifyInstance } from "fastify";
import OrderDetailController from "../controllers/order-detail.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export default async function (fastify: FastifyInstance) {
  fastify.get("/order-details", {
    preHandler: authMiddleware,
    handler: OrderDetailController.getOrderDetails,
  });

  fastify.get("/order-details/:id", {
    preHandler: authMiddleware,
    handler: OrderDetailController.getOrderDetail,
  });

  fastify.get("/order-details/order/:orderId", {
    preHandler: authMiddleware,
    handler: OrderDetailController.getDetailFromOrder,
  });

  fastify.post("/order-details", {
    preHandler: authMiddleware,
    handler: OrderDetailController.createOrderDetail,
  });

  fastify.put("/order-details/:id", {
    preHandler: authMiddleware,
    handler: OrderDetailController.updateOrderDetail,
  });

  fastify.delete("/order-details/:id", {
    preHandler: authMiddleware,
    handler: OrderDetailController.deleteOrderDetail,
  });
}
