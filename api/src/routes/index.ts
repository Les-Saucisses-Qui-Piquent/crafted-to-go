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
import orderDetailRoutes from "./order-detail.routes";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

export default fp(async (fastify: FastifyInstance) => {
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
  await fastify.register(orderDetailRoutes);
});
