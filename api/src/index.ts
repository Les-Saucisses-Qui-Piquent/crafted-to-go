import { FastifyInstance } from "fastify";
import corsPlugin from "./plugins/cors";

// Routes Imports
import routes from "./routes";
import authRoutes from "./auth/auth.routes";

export default async (fastify: FastifyInstance): Promise<void> => {
  // Register plugins
  await fastify.register(corsPlugin);

  // Register all route modules
  await fastify.register(authRoutes);

  await Promise.all(
    Object.values(routes).map((route) => {
      fastify.register(route);
    }),
  );
};
