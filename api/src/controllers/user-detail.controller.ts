import { FastifyRequest, FastifyReply } from "fastify";
import type { UserDetailInsert, UserDetailUpdate } from "../interfaces/IUserDetail";
import UserDetailRepository from "../repository/user-detail.repository";

export default class UserDetailController {
  static async getUserDetails(request: FastifyRequest, reply: FastifyReply) {
    const prisma = request.server.prisma;
    const userDetailRepository = new UserDetailRepository(prisma);
    try {
      const userDetails = await userDetailRepository.getUserDetails();
      reply.send(userDetails);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getUserDetail(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    const userDetailRepository = new UserDetailRepository(prisma);
    try {
      const detail = await userDetailRepository.getUserDetail(id);
      if (!detail) {
        reply.status(404).send({ clientMessage: "UserDetail not found" });
        return;
      }
      reply.send(detail);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getDetailFromUser(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { userId } = request.params;
    const userDetailRepository = new UserDetailRepository(prisma);
    try {
      const userDetails = await userDetailRepository.getDetailFromUser(userId);
      if (!userDetails) {
        reply.status(404).send({ clientMessage: "UserDetail not found" });
        return;
      }
      reply.send(userDetails);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async createUserDetail(
    request: FastifyRequest<{ Body: UserDetailInsert }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const userDetailRepository = new UserDetailRepository(prisma);
    try {
      const userDetail = await userDetailRepository.createUserDetail(request.body);
      reply.send(userDetail);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async updateUserDetail(
    request: FastifyRequest<{ Params: { id: string }; Body: UserDetailUpdate }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    const userDetailRepository = new UserDetailRepository(prisma);
    try {
      const userDetail = await userDetailRepository.getUserDetail(id);
      if (!userDetail) {
        reply.status(404).send({ clientMessage: "UserDetail not found" });
        return;
      }
      const userDetailUpdated = await userDetailRepository.updateUserDetail(id, request.body);
      reply.send(userDetailUpdated);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }

  static async deleteUserDetail(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const prisma = request.server.prisma;
    const { id } = request.params;
    const userDetailRepository = new UserDetailRepository(prisma);
    try {
      const userDetail = await userDetailRepository.getUserDetail(id);
      if (!userDetail) {
        reply.status(404).send({ clientMessage: "UserDetail not found" });
        return;
      }
      const deletedUserDetail = await userDetailRepository.deleteUserDetail(id);
      reply.send(deletedUserDetail);
    } catch (error) {
      request.server.log.error(error);
      reply.status(500).send({ clientMessage: "Server Error", error });
    } finally {
      await prisma.$disconnect();
    }
  }
}
