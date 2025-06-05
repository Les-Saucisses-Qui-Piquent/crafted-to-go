import { FastifyRequest, FastifyReply } from "fastify";
import { Prisma } from "@prisma/client";
import { z } from "zod";

type UserInsert = Prisma.userCreateInput;
type UserUpdate = Prisma.userUpdateInput;

export default class UserController {
  static async getUsers(request: FastifyRequest, reply: FastifyReply) {
    const prisma = request.server.prisma;
    try {
      const users = await prisma.user.findMany();
      reply.send(users);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getUser(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ message: "Invalid uuid" });
        return;
      }

      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        reply.status(404).send({ message: "User not found" });
        return;
      }

      reply.send(user);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async createUser(request: FastifyRequest<{ Body: UserInsert }>, reply: FastifyReply) {
    const prisma = request.server.prisma;
    try {
      const user = await prisma.user.create({ data: request.body });
      reply.send(user);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async updateUser(
    request: FastifyRequest<{ Params: { id: string }; Body: UserUpdate }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ message: "Invalid uuid" });
        return;
      }

      const user = await prisma.user.update({
        where: { id },
        data: request.body,
      });
      if (!user) {
        reply.status(404).send({ message: "User not found" });
        return;
      }
      reply.send(user);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async deleteUser(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(404).send({ message: "User not found" });
        return;
      }

      await prisma.user.delete({ where: { id } });
      reply.send({ message: "User deleted" });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
