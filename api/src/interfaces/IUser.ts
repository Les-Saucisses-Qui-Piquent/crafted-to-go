import { type user, Prisma } from "@prisma/client";

export type UserInsert = Prisma.userCreateInput;
export type UserUpdate = Prisma.userUpdateInput;

export interface IUser {
  getUsers: () => Promise<user[]>;
  getUser: (id: string) => Promise<user | null>;
  createUser: (payload: UserInsert) => Promise<user>;
  updateUser: (id: string, payload: UserUpdate) => Promise<user>;
  deleteUser: (id: string) => Promise<user>;
}
