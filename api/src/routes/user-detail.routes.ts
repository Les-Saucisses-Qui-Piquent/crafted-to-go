import { FastifyInstance } from "fastify";
import UserDetailController from "../controllers/user-detail.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export default async function (fastify: FastifyInstance) {
  fastify.get("/user-details", {
    preHandler: authMiddleware,
    handler: UserDetailController.getUserDetails,
  });

  fastify.get("/user-details/:id", {
    preHandler: authMiddleware,
    handler: UserDetailController.getUserDetail,
  });

  fastify.get("/user-details/user/:userId", {
    preHandler: authMiddleware,
    handler: UserDetailController.getDetailFromUser,
  });

  fastify.post("/user-details", {
    preHandler: authMiddleware,
    handler: UserDetailController.createUserDetail,
  });

  fastify.put("/user-details/:id", {
    preHandler: authMiddleware,
    handler: UserDetailController.updateUserDetail,
  });

  fastify.delete("/user-details/:id", {
    preHandler: authMiddleware,
    handler: UserDetailController.deleteUserDetail,
  });
}
