import { Prisma, PrismaClient } from "@prisma/client";
import { FastifyInstance, FastifyRequest } from "fastify";

type Test = Prisma.testCreateInput;

export default async function (fastify: FastifyInstance) {
  fastify.get("/test", async (_request, response) => {
    const prisma = new PrismaClient();
    const test = await prisma.test.findMany();
    response.send(test);
  });

  fastify.post("/test", async (request: FastifyRequest<{ Body: Test }>, response) => {
    const prisma = new PrismaClient();
    try {
      const input = request.body;

      const test = await prisma.test.create({ data: input });
      response.send(test);
    } catch (error) {
      fastify.log.error(error);
      response.status(500).send({ message: "Internal server error" });
    } finally {
      prisma.$disconnect();
    }
  });
}
