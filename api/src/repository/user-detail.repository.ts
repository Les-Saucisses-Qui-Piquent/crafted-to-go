import type { PrismaClient } from "@prisma/client";
import type { IUserDetail, UserDetailInsert, UserDetailUpdate } from "../interfaces/IUserDetail";
import z from "zod";

export default class UserDetailRepository implements IUserDetail {
  constructor(private prisma: PrismaClient) {}

  getUserDetails = async () => {
    return await this.prisma.user_detail.findMany();
  };

  getUserDetail = async (id: string) => {
    const { success, error } = z.string().uuid().safeParse(id);
    if (!success) {
      throw new Error(error.message);
    }
    return await this.prisma.user_detail.findUnique({ where: { id } });
  };

  getDetailFromUser = async (userId: string) => {
    const { success, error } = z.string().uuid().safeParse(userId);
    if (!success) {
      throw new Error(error.message);
    }
    return await this.prisma.user_detail.findMany({ where: { user_id: userId } });
  };

  createUserDetail = async (payload: UserDetailInsert) => {
    return await this.prisma.user_detail.create({ data: payload });
  };

  updateUserDetail = async (id: string, payload: UserDetailUpdate) => {
    const { success, error } = z.string().uuid().safeParse(id);
    if (!success) {
      throw new Error(error.message);
    }
    return await this.prisma.user_detail.update({ where: { id }, data: payload });
  };

  deleteUserDetail = async (id: string) => {
    const { success, error } = z.string().uuid().safeParse(id);
    if (!success) {
      throw new Error(error.message);
    }
    return await this.prisma.user_detail.delete({ where: { id } });
  };
}
