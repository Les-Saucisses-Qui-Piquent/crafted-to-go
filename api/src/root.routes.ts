import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (_request, response) => {
    response.redirect("/health");
  });

  fastify.get("/health", async (_request, response) => {
    response.send({ status: "ok" });
  });
}
