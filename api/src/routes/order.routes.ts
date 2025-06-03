import { FastifyInstance } from "fastify";
import OrderController from "../controllers/order.controller";

export default async function (fastify: FastifyInstance) {
  fastify.get("/orders", {
    handler: OrderController.getOrders,
  });

  fastify.get("/orders/:id", {
    handler: OrderController.getOrder,
  });

  fastify.post("/orders", {
    handler: OrderController.createOrder,
  });

  fastify.put("/orders/:id", {
    handler: OrderController.updateOrder,
  });

  fastify.delete("/orders/:id", {
    handler: OrderController.deleteOrder,
  });
}
