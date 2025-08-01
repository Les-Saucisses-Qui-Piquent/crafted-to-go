import { FastifyInstance } from "fastify";
import { uploadImageHandler } from "../controllers/upload.controller";
import fastifyMultipart from "@fastify/multipart";

export default async function uploadRoutes(fastify: FastifyInstance) {
  fastify.register(fastifyMultipart);

  fastify.post("/upload", uploadImageHandler);
}
