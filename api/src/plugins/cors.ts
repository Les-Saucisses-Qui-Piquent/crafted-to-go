import fp from "fastify-plugin";
import cors from "@fastify/cors";

export default fp(async (fastify) => {
  await fastify.register(cors, {
    origin: true,
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400,
  });
});
