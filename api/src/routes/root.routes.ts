import { FastifyInstance } from "fastify";
import path from "path";
import staticServer from "@fastify/static";

export default async function (fastify: FastifyInstance) {
  fastify.register(staticServer, {
    root: path.join(__dirname, "../public"),
  });

  fastify.get("/", async (_request, response) => {
    return response.sendFile("index.html");
  });

  fastify.get("/health", async (_request, response) => {
    return response.send({ status: "ok" });
  });
}
