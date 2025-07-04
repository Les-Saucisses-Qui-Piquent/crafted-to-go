import { FastifyInstance } from "fastify";
import BreweryOwnerController from "../controllers/brewery-owner.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export default async function (fastify: FastifyInstance) {
  fastify.get("/brewery-owners", {
    preHandler: authMiddleware,
    handler: BreweryOwnerController.getBreweryOwners,
  });

  fastify.get("/brewery-owners/:id", {
    preHandler: authMiddleware,
    handler: BreweryOwnerController.getBreweryOwner,
  });

  fastify.post("/brewery-owners", {
    preHandler: authMiddleware,
    handler: BreweryOwnerController.createBreweryOwner,
  });

  fastify.put("/brewery-owners/:id", {
    preHandler: authMiddleware,
    handler: BreweryOwnerController.updateBreweryOwner,
  });

  fastify.delete("/brewery-owners/:id", {
    preHandler: authMiddleware,
    handler: BreweryOwnerController.deleteBreweryOwner,
  });
}
