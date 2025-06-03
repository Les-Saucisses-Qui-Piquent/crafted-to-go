import { FastifyInstance } from "fastify";
import UserController from "../controllers/user.controller";

export default async function (fastify: FastifyInstance) {
  fastify.get("/users", {
    handler: UserController.getUsers,
  });

  fastify.get("/users/:id", {
    handler: UserController.getUser,
  });

  fastify.post("/users", {
    handler: UserController.createUser,
  });

  fastify.put("/users/:id", {
    handler: UserController.updateUser,
  });

  fastify.delete("/users/:id", {
    handler: UserController.deleteUser,
  });
}
