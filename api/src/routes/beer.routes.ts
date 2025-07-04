import { FastifyInstance } from "fastify";
import BeerController from "../controllers/beer.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export default async function (fastify: FastifyInstance) {
  fastify.get("/beers", {
    preHandler: authMiddleware,
    handler: BeerController.getBeers,
  });

  fastify.get("/beers/:id", {
    preHandler: authMiddleware,
    handler: BeerController.getBeer,
  });

  fastify.post("/beers", {
    preHandler: authMiddleware,
    handler: BeerController.createBeer,
  });

  fastify.put("/beers/:id", {
    preHandler: authMiddleware,
    handler: BeerController.updateBeer,
  });

  fastify.delete("/beers/:id", {
    preHandler: authMiddleware,
    handler: BeerController.deleteBeer,
  });
}
