import { FastifyInstance } from "fastify";
import UserController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export default async function (fastify: FastifyInstance) {
  fastify.get("/users", {
    preHandler: authMiddleware,
    handler: UserController.getUsers,
  });

  fastify.get("/users/:id", {
    preHandler: authMiddleware,
    handler: UserController.getUser,
  });

  fastify.post("/users", {
    preHandler: authMiddleware,
    handler: UserController.createUser,
  });

  fastify.put("/users/:id", {
    preHandler: authMiddleware,
    handler: UserController.updateUser,
  });

  fastify.delete("/users/:id", {
    preHandler: authMiddleware,
    handler: UserController.deleteUser,
  });
}
