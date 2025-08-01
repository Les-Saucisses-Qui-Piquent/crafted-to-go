import { FastifyInstance } from "fastify";
import FavoriteBreweryController from "../controllers/favorite-brewery.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export default async function (fastify: FastifyInstance) {
  fastify.get("/favorite-breweries/:userId", {
    preHandler: authMiddleware,
    handler: FavoriteBreweryController.getFavoriteBreweries,
  });

  fastify.post("/favorite-breweries", {
    preHandler: authMiddleware,
    handler: FavoriteBreweryController.createFavoriteBrewery,
  });

  fastify.delete("/favorite-breweries/:id", {
    preHandler: authMiddleware,
    handler: FavoriteBreweryController.deleteFavoriteBrewery,
  });
}
