import type { PrismaClient } from "@prisma/client";
import {
  IBreweryDetail,
  type BreweryDetailInsert,
  type BreweryDetailUpdate,
} from "../interfaces/IBreweryDetail";
import z from "zod";

export default class BreweryDetailRepository implements IBreweryDetail {
  constructor(private prisma: PrismaClient) {}

  getBreweryDetails = async () => {
    return await this.prisma.brewery_detail.findMany();
  };

  getBreweryDetail = async (id: string) => {
    const { success, error } = z.string().uuid().safeParse(id);
    if (!success) {
      throw new Error(error.message);
    }
    return await this.prisma.brewery_detail.findUnique({ where: { id } });
  };

  createBreweryDetail = async (payload: BreweryDetailInsert) => {
    return await this.prisma.brewery_detail.create({ data: payload });
  };

  updateBreweryDetail = async (id: string, payload: BreweryDetailUpdate) => {
    const { success, error } = z.string().uuid().safeParse(id);
    if (!success) {
      throw new Error(error.message);
    }
    return await this.prisma.brewery_detail.update({ where: { id }, data: payload });
  };

  deleteBreweryDetail = async (id: string) => {
    const { success, error } = z.string().uuid().safeParse(id);
    if (!success) {
      throw new Error(error.message);
    }
    return await this.prisma.brewery_detail.delete({ where: { id } });
  };
}
