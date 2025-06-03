import { FastifyInstance } from "fastify";
import BeerColorController from "../controllers/beer-color.controller";

export default async function (fastify: FastifyInstance) {
  fastify.get("/beer-colors", {
    handler: BeerColorController.getBeerColors,
  });
}
