import { FastifyInstance } from "fastify";
import BeerStyleController from "../controllers/beer-style.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export default async function (fastify: FastifyInstance) {
  fastify.get("/beer-styles", {
    preHandler: authMiddleware,
    handler: BeerStyleController.getBeerStyles,
  });
}
