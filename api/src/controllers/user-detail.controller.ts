import { FastifyRequest, FastifyReply } from "fastify";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

type UserDetailInsert = Prisma.user_detailCreateInput;
type UserDetailUpdate = Prisma.user_detailUpdateInput;

export default class UserDetailController {
  static async getUserDetails(_request: FastifyRequest, reply: FastifyReply) {
    const prisma = new PrismaClient();
    try {
      const userDetails = await prisma.user_detail.findMany();
      reply.send(userDetails);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getUserDetail(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = new PrismaClient();
    const { id: userId } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(userId);
      if (!success) {
        reply.status(400).send({ message: "Invalid uuid" });
        return;
      }

      const userDetails = await prisma.user_detail.findMany({
        where: { user_id: userId },
      });
      if (!userDetails) {
        reply.status(404).send({ message: "UserDetail not found" });
        return;
      }

      reply.send(userDetails);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async createUserDetail(
    request: FastifyRequest<{ Body: UserDetailInsert }>,
    reply: FastifyReply,
  ) {
    const prisma = new PrismaClient();
    try {
      const userDetail = await prisma.user_detail.create({
        data: request.body,
      });
      reply.send(userDetail);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async updateUserDetail(
    request: FastifyRequest<{ Params: { id: string }; Body: UserDetailUpdate }>,
    reply: FastifyReply,
  ) {
    const prisma = new PrismaClient();
    const { id } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ message: "Invalid uuid" });
        return;
      }
      const userDetail = await prisma.user_detail.update({
        where: { id },
        data: request.body,
      });
      if (!userDetail) {
        reply.status(404).send({ message: "UserDetail not found" });
        return;
      }
      reply.send(userDetail);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async deleteUserDetail(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = new PrismaClient();
    const { id } = request.params;
    try {
      const { success } = z.string().uuid().safeParse(id);
      if (!success) {
        reply.status(400).send({ message: "Invalid uuid" });
        return;
      }
      await prisma.user_detail.delete({ where: { id } });
      reply.send({ message: "UserDetail deleted" });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
