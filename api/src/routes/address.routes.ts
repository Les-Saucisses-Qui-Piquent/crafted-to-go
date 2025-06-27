import { FastifyInstance } from "fastify";
import AddressController from "../controllers/address.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export default async function (fastify: FastifyInstance) {
  fastify.get("/addresses", {
    preHandler: authMiddleware,
    handler: AddressController.getAddresses,
  });

  fastify.get("/addresses/:id", {
    preHandler: authMiddleware,
    handler: AddressController.getAddress,
  });

  fastify.post("/addresses", {
    preHandler: authMiddleware,
    handler: AddressController.createAddress,
  });

  fastify.put("/addresses/:id", {
    preHandler: authMiddleware,
    handler: AddressController.updateAddress,
  });

  fastify.delete("/addresses/:id", {
    preHandler: authMiddleware,
    handler: AddressController.deleteAddress,
  });
}
