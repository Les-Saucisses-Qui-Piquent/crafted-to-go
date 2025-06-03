import { FastifyInstance } from "fastify";
import FavoriteBeerController from "../controllers/favorite-beer.controller";

export default async function (fastify: FastifyInstance) {
  fastify.get("/favorite-beers/:userId", {
    handler: FavoriteBeerController.getFavoriteBeers,
  });

  fastify.post("/favorite-beers", {
    handler: FavoriteBeerController.createFavoriteBeer,
  });

  fastify.delete("/favorite-beers/:id", {
    handler: FavoriteBeerController.deleteFavoriteBeer,
  });
}
