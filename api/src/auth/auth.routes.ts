import { Prisma, PrismaClient } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { useHash } from "../../utils/hash";
import { useToken } from "../../utils/token";

type UserInsert = Prisma.userCreateInput;

export default async function (fastify: FastifyInstance) {
  const { hashPassword } = useHash();
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
}
