import { PrismaClient } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { useHash } from "../../utils/hash";
import { useToken } from "../../utils/token";
import { z } from "zod";
import { capitalize, allCaps } from "../../utils";

type UserLogin = z.infer<typeof userLoginSchema>;
type UserRegister = z.infer<typeof userRegisterSchema>;

const userLoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(12, "Password must be at least 12 characters long"),
});

const userRegisterSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(12, "Password must be at least 12 characters long"),
  first_name: z.string().min(3, "First name is required"),
  last_name: z.string().min(3, "Last name is required"),
  birth_date: z.string().min(10, "Birth date is required"),
  phone_number: z.string().length(10, "Phone number is required"),
  paiement_method: z.string().min(3, "Paiement method is required"),
});

export default async function (fastify: FastifyInstance) {
  const { hashPassword, verifyPassword } = useHash();
  const { generateToken } = useToken();

  fastify.post(
    "/auth/register",
    { preHandler: validateRegister },
    async (request: FastifyRequest<{ Body: UserRegister }>, reply: FastifyReply) => {
      const { email, password, first_name, last_name, ...rest } = request.body;
      const prisma = new PrismaClient();

      try {
        const alreadyExistingUser = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
        });
        if (alreadyExistingUser) {
          return reply.status(400).send({
            error: "User already exists",
          });
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
          data: {
            ...rest,
            password: hashedPassword,
            email: email.toLowerCase().trim(),
            first_name: capitalize(first_name.trim()),
            last_name: allCaps(last_name.trim()),
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
    { preHandler: validateLogin },
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

const validateLogin = async (request: FastifyRequest<{ Body: UserLogin }>, reply: FastifyReply) => {
  try {
    const validatedBody = userLoginSchema.parse(request.body);
    request.body = validatedBody;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ message: "Invalid request body", errors: error.errors });
    }
    throw error;
  }
};

const validateRegister = async (
  request: FastifyRequest<{ Body: UserRegister }>,
  reply: FastifyReply,
) => {
  try {
    const validatedBody = userRegisterSchema.parse(request.body);
    request.body = validatedBody;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ message: "Invalid request body", errors: error.errors });
    }
    throw error;
  }
};
