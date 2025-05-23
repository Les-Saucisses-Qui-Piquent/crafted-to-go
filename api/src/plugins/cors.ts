import fastifyPlugin from "fastify-plugin";
import cors from "@fastify/cors";

export default fastifyPlugin(async (fastify) => {
  await fastify.register(cors, {
    origin: ["http://localhost:4000"],
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    // exposedHeaders: ["set-cookie"],
    maxAge: 86400,
  });
});
