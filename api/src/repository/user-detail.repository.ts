import type { PrismaClient } from "@prisma/client";
import type { IUserDetail, UserDetailInsert, UserDetailUpdate } from "../interfaces/IUserDetail";

export default class UserDetailRepository implements IUserDetail {
  constructor(private prisma: PrismaClient) {}

  getUserDetails = async () => {
    return await this.prisma.user_detail.findMany();
  };

  getUserDetail = async (id: string) => {
    return await this.prisma.user_detail.findUnique({ where: { id } });
  };

  getDetailFromUser = async (userId: string) => {
    return await this.prisma.user_detail.findMany({ where: { user_id: userId } });
  };

  createUserDetail = async (payload: UserDetailInsert) => {
    return await this.prisma.user_detail.create({ data: payload });
  };

  updateUserDetail = async (id: string, payload: UserDetailUpdate) => {
    return await this.prisma.user_detail.update({ where: { id }, data: payload });
  };

  deleteUserDetail = async (id: string) => {
    return await this.prisma.user_detail.delete({ where: { id } });
  };
}
