import { FastifyInstance } from "fastify";
import FavoriteBeerController from "../controllers/favorite-beer.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export default async function (fastify: FastifyInstance) {
  fastify.get("/favorite-beers/:userId", {
    preHandler: authMiddleware,
    handler: FavoriteBeerController.getFavoriteBeers,
  });

  fastify.post("/favorite-beers", {
    preHandler: authMiddleware,
    handler: FavoriteBeerController.createFavoriteBeer,
  });

  fastify.delete("/favorite-beers/:id", {
    preHandler: authMiddleware,
    handler: FavoriteBeerController.deleteFavoriteBeer,
  });
}
