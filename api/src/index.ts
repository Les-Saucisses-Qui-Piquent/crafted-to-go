import { FastifyInstance } from "fastify";
import rootRoutes from "./root.routes";
import userRoutes from "./user.routes";
import testRoutes from "./test.routes";
import corsPlugin from "./plugins/cors";

export default async (fastify: FastifyInstance): Promise<void> => {
  // Register plugins
  await fastify.register(corsPlugin);

  // Register all route modules
  await fastify.register(rootRoutes);
  await fastify.register(userRoutes);
  await fastify.register(testRoutes);
};
