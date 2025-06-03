import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

type UserDetailInsert = Prisma.user_detailCreateInput;
type UserDetailUpdate = Prisma.user_detailUpdateInput;

export default async function (fastify: FastifyInstance) {
  fastify.get("/user-details", async (_request, response: FastifyReply) => {
    const prisma = new PrismaClient();
    try {
      const userDetails = await prisma.user_detail.findMany();
      response.send(userDetails);
    } catch (error) {
      fastify.log.error(error, "Error fetching user details");
      response.status(500).send({ message: "Internal server error" });
    } finally {
      await prisma.$disconnect();
    }
  });

  fastify.get(
    "/user-details/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, response: FastifyReply) => {
      const prisma = new PrismaClient();
      const { id } = request.params;

      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid uuid" });
        }

        const userDetail = await prisma.user_detail.findUnique({
          where: { id },
        });

        if (!userDetail) {
          fastify.log.warn({ id }, "User detail not found");
          response.status(404).send({ message: "User detail not found" });
        } else {
          response.send(userDetail);
        }
      } catch (error) {
        fastify.log.error({ error, id }, "Error fetching user detail");
        response.status(500).send({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  fastify.post(
    "/user-details",
    async (request: FastifyRequest<{ Body: UserDetailInsert }>, response: FastifyReply) => {
      const prisma = new PrismaClient();
      const userDetail = request.body;

      try {
        const newUserDetail = await prisma.user_detail.create({
          data: userDetail,
        });

        response.send(newUserDetail);
      } catch (error) {
        fastify.log.error({ error, userDetail }, "Error creating user detail");
        response.status(500).send({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  fastify.put(
    "/user-details/:id",
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: UserDetailUpdate }>,
      response: FastifyReply,
    ) => {
      const prisma = new PrismaClient();
      const { id } = request.params;
      const valuesToUpdate = request.body;

      try {
        const { success: isIdValid } = z.string().uuid().safeParse(id);
        if (!isIdValid) {
          response.status(400).send({ message: "Invalid uuid" });
        }

        const updatedUserDetail = await prisma.user_detail.update({
          where: { id },
          data: valuesToUpdate,
        });

        if (!updatedUserDetail) {
          fastify.log.warn("User detail not found");
          response.status(404).send({ message: "User detail not found" });
        } else {
          response.send(updatedUserDetail);
        }
      } catch (error) {
        fastify.log.error({ error, valuesToUpdate }, "Error updating user detail");
        response.status(500).send({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  fastify.delete(
    "/user-details/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, response: FastifyReply) => {
      const prisma = new PrismaClient();
      const { id } = request.params;

      try {
        const { success } = z.string().uuid().safeParse(id);

        if (!success) {
          response.status(400).send({ message: "Invalid uuid" });
        }

        await prisma.user_detail.delete({
          where: { id },
        });
        fastify.log.warn({ id }, "Deleted user detail");
        response.send({ message: "User detail deleted" });
      } catch (error) {
        fastify.log.error({ error, id }, "Error deleting user detail");
        response.status(500).send({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );
}
