import { FastifyInstance } from "fastify";
import AddressController from "../controllers/address.controller";

export default async function (fastify: FastifyInstance) {
  fastify.get("/addresses", {
    handler: AddressController.getAddresses,
  });

  fastify.get("/addresses/:id", {
    handler: AddressController.getAddress,
  });

  fastify.post("/addresses", {
    handler: AddressController.createAddress,
  });

  fastify.put("/addresses/:id", {
    handler: AddressController.updateAddress,
  });

  fastify.delete("/addresses/:id", {
    handler: AddressController.deleteAddress,
  });
}
