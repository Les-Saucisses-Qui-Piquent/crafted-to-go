import fastifyPlugin from "fastify-plugin";
import cors from "@fastify/cors";

export default fastifyPlugin(async (fastify) => {
  const frontendUrl = process.env.FRONTEND_URL;

  if (!frontendUrl) {
    console.error("FRONTEND_URL is not defined");
    process.exit(1);
  }

  await fastify.register(cors, {
    origin: frontendUrl, // ✅ Un seul domaine, pas de tableau
    credentials: true, // ✅ Nécessaire pour allow credentials
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  });
});
