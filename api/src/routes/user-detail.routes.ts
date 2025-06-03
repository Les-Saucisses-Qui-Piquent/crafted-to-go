import { FastifyInstance } from "fastify";
import UserDetailController from "../controllers/user-detail.controller";

export default async function (fastify: FastifyInstance) {
  fastify.get("/user-details", {
    handler: UserDetailController.getUserDetails,
  });

  fastify.get("/user-details/:id", {
    handler: UserDetailController.getUserDetail,
  });

  fastify.get("/user-details/user/:userId", {
    handler: UserDetailController.getDetailFromUser,
  });

  fastify.post("/user-details", {
    handler: UserDetailController.createUserDetail,
  });

  fastify.put("/user-details/:id", {
    handler: UserDetailController.updateUserDetail,
  });

  fastify.delete("/user-details/:id", {
    handler: UserDetailController.deleteUserDetail,
  });
}
