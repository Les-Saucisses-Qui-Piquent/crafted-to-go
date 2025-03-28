import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.get("/test", async (_request, response) => {
    const prisma = new PrismaClient();
    const test = await prisma.test.findMany();
    response.send(test);
  });
}
