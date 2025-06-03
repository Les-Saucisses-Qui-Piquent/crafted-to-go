import { FastifyInstance } from "fastify";
import BreweryController from "../controllers/brewery.controller";

export default async function (fastify: FastifyInstance) {
  fastify.get("/breweries", {
    handler: BreweryController.getBreweries,
  });

  fastify.get("/breweries/:id", {
    handler: BreweryController.getBrewery,
  });

  fastify.post("/breweries", {
    handler: BreweryController.createBrewery,
  });

  fastify.put("/breweries/:id", {
    handler: BreweryController.updateBrewery,
  });

  fastify.delete("/breweries/:id", {
    handler: BreweryController.deleteBrewery,
  });
}
