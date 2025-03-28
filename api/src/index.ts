import { FastifyInstance } from "fastify";
import rootRoutes from "./root.routes";
import userRoutes from "./user.routes";
import testRoutes from "./test.routes";

export default async (fastify: FastifyInstance): Promise<void> => {
  // Register all route modules
  await fastify.register(rootRoutes);
  await fastify.register(userRoutes);
  await fastify.register(testRoutes);
};
