import { FastifyInstance } from "fastify";
import BeerStyleController from "../controllers/beer-style.controller";

export default async function (fastify: FastifyInstance) {
  fastify.get("/beer-styles", {
    handler: BeerStyleController.getBeerStyles,
  });
}
