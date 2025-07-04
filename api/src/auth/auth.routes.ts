import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { useHash } from "../../utils/hash";
import { useToken } from "../../utils/token";
import { z } from "zod";
import { capitalize, allCaps } from "../../utils";

type UserLogin = z.infer<typeof userLoginSchema>;
type UserRegister = z.infer<typeof userRegisterSchema>;

type BreweryRegister = z.infer<typeof breweryRegisterSchema>;

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
});

const breweryOwnerSchema = z.object({
  first_name: z.string().min(3, "First name is required"),
  last_name: z.string().min(3, "Last name is required"),
  owner_phone_number: z.string().length(10, "Phone number is required"),
  birth_date: z.string().min(10, "Birth date is required"),
  owner_email: z.string().email("Invalid email"),
  password: z.string().min(12, "Password must be at least 12 characters long"),
});

const addressSchema = z.object({
  address_line_1: z.string().min(3, "Address line 1 is required"),
  address_line_2: z.string().optional(),
  postal_code: z.string().min(5, "Postal code is required"),
  city: z.string().min(3, "City is required"),
  country: z.string().min(3, "Country is required"),
});

const brewerySchema = z.object({
  brewery_name: z.string().min(3, "Brewery name is required"),
  rib: z.string().min(10, "RIB is required"),
  siren: z.string().min(9, "SIREN is required"),
});

const openingHoursSchema = z.object({
  monday: z.object({ isOpen: z.boolean() }),
  tuesday: z.object({ isOpen: z.boolean() }),
  wednesday: z.object({ isOpen: z.boolean() }),
  thursday: z.object({ isOpen: z.boolean() }),
  friday: z.object({ isOpen: z.boolean() }),
  saturday: z.object({ isOpen: z.boolean() }),
  sunday: z.object({ isOpen: z.boolean() }),
});

const breweryDetailSchema = z.object({
  description: z.string().min(10, "Description is required"),
  social_links: z.array(z.string()).min(1, "At least one social link is required"),
  opening_hours: openingHoursSchema,
  has_taproom: z.boolean(),
  taproom_hours: openingHoursSchema,
  brewery_email: z.string().email("Invalid email"),
  brewery_phone_number: z.string().length(10, "Phone number is required"),
});

const breweryRegisterSchema = z.object({
  ...breweryOwnerSchema.shape,
  ...addressSchema.shape,
  ...brewerySchema.shape,
  ...breweryDetailSchema.shape,
});

export default async function (fastify: FastifyInstance) {
  const { hashPassword, verifyPassword } = useHash();
  const { generateToken } = useToken();

  fastify.post(
    "/auth/register",
    { preHandler: validateRegister },
    async (request: FastifyRequest<{ Body: UserRegister }>, reply: FastifyReply) => {
      const { email, password, first_name, last_name, ...rest } = request.body;
      const prisma = request.server.prisma;

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

        const tokenizedUser = {
          id: user.id,
          email: user.email,
          role: user.role,
        };

        const token = generateToken(tokenizedUser);

        return reply.status(201).send({ token, user: tokenizedUser });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
    },
  );

  fastify.post(
    "/auth/register/brewery",
    { preHandler: validateBreweryRegister },
    async (request: FastifyRequest<{ Body: BreweryRegister }>, reply: FastifyReply) => {
      const prisma = request.server.prisma;

      try {
        await prisma.$transaction(async (tx) => {
          // 1) Create address
          const {
            address_line_1,
            address_line_2,
            postal_code,
            city,
            country,
            ...breweryOwnerAndRest
          } = request.body;

          const address = await tx.address.create({
            data: {
              line_1: address_line_1,
              line_2: address_line_2,
              postal_code,
              city,
              country,
            },
          });

          // 2.a) Create brewery owner
          const {
            owner_email,
            password,
            first_name,
            last_name,
            birth_date,
            owner_phone_number,
            ...breweryAndRest
          } = breweryOwnerAndRest;

          const hashedPassword = await hashPassword(password);

          const breweryOwnerUser = await tx.user.create({
            data: {
              email: owner_email,
              password: hashedPassword,
              first_name: capitalize(first_name.trim()),
              last_name: allCaps(last_name.trim()),
              birth_date,
              phone_number: owner_phone_number,
            },
          });

          // 2.b) // Joint on brewery_owner
          await tx.brewery_owner.create({
            data: {
              user_id: breweryOwnerUser.id,
              address_id: address.id,
            },
          });

          // 3) Create brewery
          const { brewery_name, rib, siren, ...breweryDetail } = breweryAndRest;
          const brewery = await tx.brewery.create({
            data: {
              name: brewery_name,
              RIB: rib,
              siren,
              brewery_owner_id: breweryOwnerUser.id,
              address_id: address.id,
            },
          });

          // 4) Create brewery detail
          const {
            description,
            social_links,
            opening_hours,
            has_taproom,
            taproom_hours,
            brewery_email,
            brewery_phone_number,
          } = breweryDetail;

          await tx.brewery_detail.create({
            data: {
              brewery_id: brewery.id,
              description,
              social_links,
              opening_hours,
              has_taproom,
              taproom_hours,
              phone_number: brewery_phone_number,
              email: brewery_email,
            },
          });

          const tokenizedBreweryOwnerUser = {
            id: breweryOwnerUser.id,
            email: breweryOwnerUser.email,
            role: breweryOwnerUser.role,
          };

          const token = generateToken(tokenizedBreweryOwnerUser);

          return reply.status(201).send({ token, user: tokenizedBreweryOwnerUser });
        });
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
      const prisma = request.server.prisma;

      try {
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
          select: {
            id: true,
            email: true,
            role: true,
            password: true,
          },
        });
        if (!user) {
          return reply.status(401).send({ message: "Invalid credentials" });
        }

        const { password: hashedPassword, ...userWithoutPassword } = user;

        const isPasswordValid = await verifyPassword(password, hashedPassword);
        if (!isPasswordValid) {
          return reply.status(401).send({ message: "Password not valid" });
        }

        const token = generateToken(userWithoutPassword);

        return reply.status(200).send({ token, user: userWithoutPassword });
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
      console.error(error.errors);
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
      console.error(error.errors);
      return reply.status(400).send({ message: "Invalid request body", errors: error.errors });
    }
    throw error;
  }
};

const validateBreweryRegister = async (
  request: FastifyRequest<{ Body: BreweryRegister }>,
  reply: FastifyReply,
) => {
  try {
    const validatedBody = breweryRegisterSchema.parse(request.body);
    request.body = validatedBody;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(error.errors);
      return reply.status(400).send({ message: "Invalid request body", errors: error.errors });
    }
    throw error;
  }
};
