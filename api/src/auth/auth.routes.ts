import { Prisma, PrismaClient } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { useHash } from "../../utils/hash";
import { useToken } from "../../utils/token";

type UserInsert = Prisma.userCreateInput;
type UserLogin = {
  email: string;
  password: string;
};

export default async function (fastify: FastifyInstance) {
  const { hashPassword, verifyPassword } = useHash();
  const { generateToken } = useToken();

  fastify.post(
    "/auth/register",
    async (request: FastifyRequest<{ Body: UserInsert }>, reply: FastifyReply) => {
      const { email, password, first_name, last_name, ...rest } = request.body;
      const prisma = new PrismaClient();

      try {
        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
          data: {
            ...rest,
            password: hashedPassword,
            email: email.toLowerCase().trim(),
            first_name: first_name.trim(),
            last_name: last_name.trim(),
          },
        });

        const token = generateToken(user.id);

        return reply.status(201).send({ token });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  fastify.post(
    "/auth/login",
    async (request: FastifyRequest<{ Body: UserLogin }>, reply: FastifyReply) => {
      const { email, password } = request.body;
      const prisma = new PrismaClient();

      try {
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
        });
        if (!user) {
          return reply.status(401).send({ message: "Invalid credentials" });
        }

        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
          return reply.status(401).send({ message: "Password not valid" });
        }

        const token = generateToken(user.id);

        return reply.status(200).send({ token });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );
}
