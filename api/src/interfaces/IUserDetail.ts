import { type user_detail, Prisma } from "@prisma/client";

export type UserDetailInsert = Prisma.user_detailCreateInput;
export type UserDetailUpdate = Prisma.user_detailUpdateInput;

export interface IUserDetail {
  getUserDetails: () => Promise<user_detail[]>;
  getUserDetail: (id: string) => Promise<user_detail | null>;
  getDetailFromUser: (userId: string) => Promise<user_detail[]>;
  createUserDetail: (payload: UserDetailInsert) => Promise<user_detail>;
  updateUserDetail: (id: string, payload: UserDetailUpdate) => Promise<user_detail>;
  deleteUserDetail: (id: string) => Promise<user_detail>;
}
