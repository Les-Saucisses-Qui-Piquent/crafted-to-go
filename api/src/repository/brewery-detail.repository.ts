import type { PrismaClient } from "@prisma/client";
import {
  IBreweryDetail,
  type BreweryDetailInsert,
  type BreweryDetailUpdate,
} from "../interfaces/IBreweryDetail";

export default class BreweryDetailRepository implements IBreweryDetail {
  constructor(private prisma: PrismaClient) {}

  getBreweryDetails = async () => {
    return await this.prisma.brewery_detail.findMany();
  };

  getBreweryDetail = async (id: string) => {
    return await this.prisma.brewery_detail.findUnique({ where: { id } });
  };

  createBreweryDetail = async (payload: BreweryDetailInsert) => {
    return await this.prisma.brewery_detail.create({ data: payload });
  };

  updateBreweryDetail = async (id: string, payload: BreweryDetailUpdate) => {
    return await this.prisma.brewery_detail.update({ where: { id }, data: payload });
  };

  deleteBreweryDetail = async (id: string) => {
    return await this.prisma.brewery_detail.delete({ where: { id } });
  };
}
