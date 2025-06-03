import { FastifyInstance } from "fastify";
import BreweryDetailController from "../controllers/brewery-detail.controller";

export default async function (fastify: FastifyInstance) {
  fastify.get("/brewery-details", {
    handler: BreweryDetailController.getBreweryDetails,
  });

  fastify.get("/brewery-details/:id", {
    handler: BreweryDetailController.getBreweryDetail,
  });

  fastify.post("/brewery-details", {
    handler: BreweryDetailController.createBreweryDetail,
  });

  fastify.put("/brewery-details/:id", {
    handler: BreweryDetailController.updateBreweryDetail,
  });

  fastify.delete("/brewery-details/:id", {
    handler: BreweryDetailController.deleteBreweryDetail,
  });
}
