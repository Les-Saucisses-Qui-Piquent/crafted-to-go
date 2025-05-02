import { FastifyInstance } from "fastify";
import corsPlugin from "./plugins/cors";

// Routes Imports
import rootRoutes from "./root.routes";
import userRoutes from "./user.routes";
import testRoutes from "./test.routes";
import orderRoutes from "./order.routes";
import beerRoutes from "./beer.routes";

export default async (fastify: FastifyInstance): Promise<void> => {
  // Register plugins
  await fastify.register(corsPlugin);

  // Register all route modules
  await fastify.register(rootRoutes);
  await fastify.register(userRoutes);
  await fastify.register(testRoutes);
  await fastify.register(orderRoutes);
  await fastify.register(beerRoutes);
};
