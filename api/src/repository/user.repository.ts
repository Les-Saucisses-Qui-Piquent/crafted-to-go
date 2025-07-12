import type { PrismaClient } from "@prisma/client";
import type { IUser, UserInsert, UserUpdate } from "../interfaces/IUser";

export default class UserRepository implements IUser {
  constructor(private prisma: PrismaClient) {}

  getUsers = async () => {
    return await this.prisma.user.findMany();
  };

  getUser = async (id: string) => {
    return await this.prisma.user.findUnique({ where: { id } });
  };

  createUser = async (payload: UserInsert) => {
    return await this.prisma.user.create({ data: payload });
  };

  updateUser = async (id: string, payload: UserUpdate) => {
    return await this.prisma.user.update({ where: { id }, data: payload });
  };

  deleteUser = async (id: string) => {
    return await this.prisma.user.delete({ where: { id } });
  };
}
