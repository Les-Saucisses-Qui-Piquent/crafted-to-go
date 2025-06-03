import { FastifyInstance } from "fastify";
import BreweryOwnerController from "../controllers/brewery-owner.controller";

export default async function (fastify: FastifyInstance) {
  fastify.get("/brewery-owners", {
    handler: BreweryOwnerController.getBreweryOwners,
  });

  fastify.get("/brewery-owners/:id", {
    handler: BreweryOwnerController.getBreweryOwner,
  });

  fastify.post("/brewery-owners", {
    handler: BreweryOwnerController.createBreweryOwner,
  });

  fastify.put("/brewery-owners/:id", {
    handler: BreweryOwnerController.updateBreweryOwner,
  });

  fastify.delete("/brewery-owners/:id", {
    handler: BreweryOwnerController.deleteBreweryOwner,
  });
}
