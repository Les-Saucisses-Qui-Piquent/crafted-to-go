import { FastifyInstance } from "fastify";
import BreweryController from "../controllers/brewery.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export default async function (fastify: FastifyInstance) {
  fastify.get("/breweries", {
    preHandler: authMiddleware,
    handler: BreweryController.getBreweries,
  });

  fastify.get("/breweries/:id", {
    preHandler: authMiddleware,
    handler: BreweryController.getBrewery,
  });

  fastify.post("/breweries", {
    preHandler: authMiddleware,
    handler: BreweryController.createBrewery,
  });

  fastify.put("/breweries/:id", {
    preHandler: authMiddleware,
    handler: BreweryController.updateBrewery,
  });

  fastify.delete("/breweries/:id", {
    preHandler: authMiddleware,
    handler: BreweryController.deleteBrewery,
  });
}
