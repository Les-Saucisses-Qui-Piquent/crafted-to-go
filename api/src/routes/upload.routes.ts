import { FastifyInstance } from "fastify";
import { uploadImageHandler } from "../controllers/upload.controller";
import fastifyMultipart from "@fastify/multipart";

export default async function uploadRoutes(server: FastifyInstance) {
  server.register(fastifyMultipart);

  server.post("/upload", uploadImageHandler);
}
