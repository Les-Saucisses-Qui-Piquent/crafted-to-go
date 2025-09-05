import { FastifyInstance } from "fastify";
import corsPlugin from "./plugins/cors";
// Routes Imports
import routes from "./routes";
import authRoutes from "./auth/auth.routes";
import fastifyMultipart from "@fastify/multipart";

export default async (fastify: FastifyInstance): Promise<void> => {
  // Register plugins
  await fastify.register(corsPlugin);
  await fastify.register(fastifyMultipart, {
    attachFieldsToBody: true, // <--- AJOUTE CECI
  });
  // Register all route modules
  await fastify.register(authRoutes);

  for (const route of Object.values(routes)) {
    await fastify.register(route);
  }
};
