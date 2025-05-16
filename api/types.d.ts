import "fastify";
import type { JwtPayload } from "jsonwebtoken";

/**
 * Decorate and augments the FastifyRequest with token infos
 * This will render authUser available on all authenticated routes
 */
declare module "fastify" {
  interface FastifyRequest {
    authUser: JwtPayload | string;
  }
}
