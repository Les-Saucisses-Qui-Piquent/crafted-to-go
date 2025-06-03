import { FastifyInstance } from "fastify";
import FavoriteBreweryController from "../controllers/favorite-brewery.controller";

export default async function (fastify: FastifyInstance) {
  fastify.get("/favorite-breweries/:userId", {
    handler: FavoriteBreweryController.getFavoriteBreweries,
  });

  fastify.post("/favorite-breweries", {
    handler: FavoriteBreweryController.createFavoriteBrewery,
  });

  fastify.delete("/favorite-breweries/:id", {
    handler: FavoriteBreweryController.deleteFavoriteBrewery,
  });
}
