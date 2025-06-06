import type { FastifyInstance } from "fastify";
import type { PrismaClient } from "@prisma/client";
import Fastify from "fastify";
import routes from "../src/routes";
import authRoutes from "../src/auth/auth.routes";
import { vi } from "vitest";
import prisma from "../libs/__mocks__/prisma";

vi.mock("../libs/prisma");

// Create a type for the app with prisma
interface AppWithPrisma extends FastifyInstance {
  prisma: PrismaClient;
}

export const createTestServer = async (): Promise<AppWithPrisma> => {
  const app = Fastify({
    logger: false,
  });

  app.decorate("prisma", prisma);

  await app.register(authRoutes);

  await Promise.all(
    Object.values(routes).map((route) => {
      app.register(route);
    }),
  );

  // Ready the server
  await app.ready();

  return app;
};
