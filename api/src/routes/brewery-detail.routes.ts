import { FastifyInstance } from "fastify";
import BreweryDetailController from "../controllers/brewery-detail.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export default async function (fastify: FastifyInstance) {
  fastify.get("/brewery-details", {
    preHandler: authMiddleware,
    handler: BreweryDetailController.getBreweryDetails,
  });

  fastify.get("/brewery-details/:id", {
    preHandler: authMiddleware,
    handler: BreweryDetailController.getBreweryDetail,
  });

  fastify.post("/brewery-details", {
    preHandler: authMiddleware,
    handler: BreweryDetailController.createBreweryDetail,
  });

  fastify.put("/brewery-details/:id", {
    preHandler: authMiddleware,
    handler: BreweryDetailController.updateBreweryDetail,
  });

  fastify.delete("/brewery-details/:id", {
    preHandler: authMiddleware,
    handler: BreweryDetailController.deleteBreweryDetail,
  });
}
