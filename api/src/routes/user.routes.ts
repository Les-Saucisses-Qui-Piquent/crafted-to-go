import { Prisma, PrismaClient } from "@prisma/client";
import { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";

type UserInsert = Prisma.userCreateInput;
type UserUpdate = Prisma.userUpdateInput;

export default async function (fastify: FastifyInstance) {
  // Route GET pour récupérer tous les utilisateurs
  fastify.get("/users", async (_request, response) => {
    const prisma = new PrismaClient();
    try {
      const users = await prisma.user.findMany();
      response.send(users);
    } catch (error) {
      fastify.log.error(error);
      response.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  });

  // Route GET pour récupérer un utilisateur
  fastify.get(
    "/users/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, response) => {
      const prisma = new PrismaClient();
      const { id } = request.params;
      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid uuid" });
        }
        const user = await prisma.user.findUnique({
          where: { id: id },
        });
        if (!user) {
          fastify.log.warn({ id }, "User not found");
          response.status(404).send({ message: "User not found" });
          return;
        }
        response.send(user);
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ message: "Server Error", error });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  // Route POST pour ajouter un utilisateur
  fastify.post("/users", async (request: FastifyRequest<{ Body: UserInsert }>, response) => {
    const prisma = new PrismaClient();
    try {
      const input = request.body;
      const user = await prisma.user.create({ data: input });
      response.send(user);
    } catch (error) {
      fastify.log.error(error);
      response.status(500).send({ message: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  });

  // Route PUT pour modifier un utilisateur
  fastify.put(
    "/users/:id",
    async (request: FastifyRequest<{ Params: { id: string }; Body: UserUpdate }>, response) => {
      const prisma = new PrismaClient();
      const { id } = request.params;
      const data = request.body;
      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid uuid" });
        }
        const user = await prisma.user.update({
          where: { id: id },
          data: data,
        });
        if (!user) {
          response.status(404).send({ message: "User not found" });
          return;
        }
        response.send(user);
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ message: "Server Error", error });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  // Route DELETE pour supprimer un utilisateur
  fastify.delete(
    "/users/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, response) => {
      const prisma = new PrismaClient();
      const { id } = request.params;
      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid uuid" });
        }
        await prisma.user.delete({
          where: { id: id },
        });
        fastify.log.warn({ id }, "Deleted user");
        response.send({ message: "User deleted" });
      } catch (error) {
        fastify.log.error(error);
        response.status(500).send({ message: "Server Error", error });
      } finally {
        await prisma.$disconnect();
      }
    },
  );
}
