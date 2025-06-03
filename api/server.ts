import Fastify from "fastify";
import server from "./src/index";

if (!process.env.FRONTEND_URL) {
  console.error("FRONTEND_URL is not defined. Server will not start.");
  process.exit(1);
}

const fastify = Fastify({
  logger: true,
});

fastify.register(server);

fastify.listen({ host: "0.0.0.0", port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
