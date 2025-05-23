import { FastifyInstance } from "fastify";
import corsPlugin from "./plugins/cors";

// Routes Imports
import rootRoutes from "./root.routes";
import userRoutes from "./user.routes";
import testRoutes from "./test.routes";
import orderRoutes from "./order.routes";
import beerRoutes from "./beer.routes";
import breweryRoutes from "./brewery.routes";
import addressRoutes from "./address.routes";
import beerColorRoutes from "./beer-color.routes";
import beerStyleRoutes from "./beer-style.routes";
import userDetailRoutes from "./user-detail.routes";
import breweryDetailRoutes from "./brewery-detail.routes";
import breweryOwnerRoutes from "./brewery-owner.routes";
import orderDetailRoutes from "./order-detail.routes";
import authRoutes from "./auth/auth.routes";

export default async (fastify: FastifyInstance): Promise<void> => {
  // Register plugins
  await fastify.register(corsPlugin);

  // Register all route modules
  await fastify.register(authRoutes);
  await fastify.register(rootRoutes);
  await fastify.register(userRoutes);
  await fastify.register(testRoutes);
  await fastify.register(orderRoutes);
  await fastify.register(beerRoutes);
  await fastify.register(breweryRoutes);
  await fastify.register(addressRoutes);
  await fastify.register(beerColorRoutes);
  await fastify.register(beerStyleRoutes);
  await fastify.register(userDetailRoutes);
  await fastify.register(breweryDetailRoutes);
  await fastify.register(breweryOwnerRoutes);
  await fastify.register(orderDetailRoutes);
};
