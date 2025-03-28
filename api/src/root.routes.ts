import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (request, response) => {
    response.send({ root: true });
  });
}
