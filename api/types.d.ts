import "fastify";
import type { JwtPayload } from "jsonwebtoken";
import type { PrismaClient } from "@prisma/client";

export type AuthUser = {
  id: string;
  email: string;
  role: string;
};

export type CustomJwtPayload = {
  authUser: AuthUser;
} & JwtPayload;

/**
 * Decorate and augments the FastifyRequest with token infos
 * This will render authUser available on all authenticated routes
 */
declare module "fastify" {
  interface FastifyRequest {
    token: JwtPayload | string;
    authUser: AuthUser;
    prisma: PrismaClient;
  }
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
