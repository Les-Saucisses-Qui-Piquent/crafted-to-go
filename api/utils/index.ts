import { FastifyReply } from "fastify";
import { z } from "zod";

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const allCaps = (str: string) => {
  return str.toUpperCase();
};

export const validateUUID = (id: string, reply: FastifyReply) => {
  const { success } = z.string().uuid().safeParse(id);
  if (!success) {
    reply.status(400).send({ clientMessage: "Invalid uuid" });
    return;
  }
};
