import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

export default async function (fastify: FastifyInstance) {
  fastify.get("/users", async (request, response) => {
    const prisma = new PrismaClient();
    const users = await prisma.user.findMany();

    response.send(users);
  });
}
