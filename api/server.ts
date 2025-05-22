import Fastify from "fastify";
import routes from "./src/index";

const fastify = Fastify({
  logger: true,
});

fastify.register(routes);

fastify.listen({ host: "0.0.0.0", port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
