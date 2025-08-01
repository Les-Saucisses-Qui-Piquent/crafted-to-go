import { FastifyInstance } from "fastify";
import fastifyMultipart from "@fastify/multipart";
import { ImageUploader } from "../services/upload.service";

export default async function uploadRoutes(fastify: FastifyInstance) {
  fastify.register(fastifyMultipart);

  fastify.post("/upload", async (req, res) => {
    const data = await ImageUploader.upload(req);
    res.send({ url: data.url });
  });
}
