import { FastifyRequest, FastifyReply } from "fastify";
import type { UserInsert, UserUpdate } from "../interfaces/IUser";
import UserRepository from "../repository/user.repository";

export default class UserController {
  static async getUsers(request: FastifyRequest, reply: FastifyReply) {
    const prisma = request.server.prisma;
    const userRepository = new UserRepository(prisma);
    try {
      const users = await userRepository.getUsers();
      reply.send(users);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getUser(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    const userRepository = new UserRepository(prisma);
    try {
      const user = await userRepository.getUser(id);
      if (!user) {
        reply.status(404).send({ clientMessage: "User not found" });
        return;
      }
      reply.send(user);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async createUser(request: FastifyRequest<{ Body: UserInsert }>, reply: FastifyReply) {
    const prisma = request.server.prisma;
    const userRepository = new UserRepository(prisma);
    try {
      const user = await userRepository.createUser(request.body);
      reply.send(user);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error" });
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
    const userRepository = new UserRepository(prisma);
    try {
      const user = await userRepository.getUser(id);
      if (!user) {
        reply.status(404).send({ clientMessage: "User not found" });
        return;
      }
      const userUpdated = await userRepository.updateUser(id, request.body);
      reply.send(userUpdated);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
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
    const userRepository = new UserRepository(prisma);
    try {
      const user = await userRepository.getUser(id);
      if (!user) {
        reply.status(404).send({ clientMessage: "User not found" });
        return;
      }
      const deletedUser = await userRepository.deleteUser(id);
      reply.send(deletedUser);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
