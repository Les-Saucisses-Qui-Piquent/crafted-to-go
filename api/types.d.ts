import "fastify";
import type { JwtPayload } from "jsonwebtoken";

declare module "fastify" {
  interface FastifyRequest {
    authUser: JwtPayload | string;
  }
}
