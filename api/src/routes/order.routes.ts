import { FastifyInstance } from "fastify";
import OrderController from "../controllers/order.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export default async function (fastify: FastifyInstance) {
  fastify.get("/orders", {
    preHandler: authMiddleware,
    handler: OrderController.getOrders,
  });

  fastify.get("/orders/:id", {
    preHandler: authMiddleware,
    handler: OrderController.getOrder,
  });

  fastify.post("/orders", {
    preHandler: authMiddleware,
    handler: OrderController.createOrder,
  });

  fastify.put("/orders/:id", {
    preHandler: authMiddleware,
    handler: OrderController.updateOrder,
  });

  fastify.delete("/orders/:id", {
    preHandler: authMiddleware,
    handler: OrderController.deleteOrder,
  });
}
