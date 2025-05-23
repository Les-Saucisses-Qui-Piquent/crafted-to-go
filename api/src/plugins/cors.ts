import fastifyPlugin from "fastify-plugin";
import cors from "@fastify/cors";

export default fastifyPlugin(async (fastify) => {
  if (!process.env.FRONTEND_URL) {
    console.error("FRONTEND_URL is not defined");
    process.exit(1);
  }

  await fastify.register(cors, {
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    // exposedHeaders: ["set-cookie"],
    maxAge: 86400,
  });
});
