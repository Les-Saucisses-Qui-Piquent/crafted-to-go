import { Prisma, PrismaClient } from "@prisma/client";
import { authMiddleware } from "./middlewares/auth.middleware";
import { FastifyInstance, FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";

interface TestInsert extends RouteGenericInterface {
  Body: Prisma.testCreateInput;
}

export default async function (fastify: FastifyInstance) {
  fastify.get("/test", async (_request: FastifyRequest, reply: FastifyReply) => {
    const prisma = new PrismaClient();
    const test = await prisma.test.findMany();
    reply.send(test);
  });

  fastify.post(
    "/test",
    { preHandler: authMiddleware },
    async (request: FastifyRequest<TestInsert>, reply: FastifyReply) => {
      const prisma = new PrismaClient();
      try {
        const input = request.body;

        const test = await prisma.test.create({ data: input });
        reply.send(test);
      } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ message: "Internal server error" });
      } finally {
        prisma.$disconnect();
      }
    },
  );
}
