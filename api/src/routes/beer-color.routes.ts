import { FastifyInstance } from "fastify";
import BeerColorController from "../controllers/beer-color.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export default async function (fastify: FastifyInstance) {
  fastify.get("/beer-colors", {
    preHandler: authMiddleware,
    handler: BeerColorController.getBeerColors,
  });
}
