import Fastify from "fastify";
import server from "./src/index";
import { PrismaClient } from "@prisma/client";

if (!process.env.FRONTEND_URL) {
  console.error("FRONTEND_URL is not defined. Server will not start.");
  process.exit(1);
}

const fastify = Fastify({
  logger: true,
});

fastify.decorate("prisma", new PrismaClient());

fastify.register(server);
fastify.ready();

const start = async () => {
  fastify.listen({ host: "0.0.0.0", port: 3000 }, (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    fastify.log.info(`Server listening at ${address}`);
  });
};

const shutdown = async () => {
  fastify.log.info("Shutting down server...");
  await fastify.close();
  await fastify.prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start();
