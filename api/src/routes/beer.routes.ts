import type { FastifyInstance } from "fastify";
import BeerController from "../controllers/beer.controller";

export default async function (fastify: FastifyInstance) {
  fastify.get("/beers", {
    handler: BeerController.getBeers,
  });

  fastify.get("/beers/:id", {
    handler: BeerController.getBeer,
  });

  fastify.post("/beers", {
    handler: BeerController.createBeer,
  });

  fastify.put("/beers/:id", {
    handler: BeerController.updateBeer,
  });

  fastify.delete("/beers/:id", {
    handler: BeerController.deleteBeer,
  });
}
