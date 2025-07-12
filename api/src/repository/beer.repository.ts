import type { PrismaClient } from "@prisma/client";
import { IBeer, type BeerInsert, type BeerUpdate } from "../interfaces/IBeer";
import z from "zod";

export default class BeerRepository implements IBeer {
  constructor(private prisma: PrismaClient) {}

  getBeers = async () => {
    return await this.prisma.beer.findMany();
  };

  getBeer = async (id: string) => {
    const { success, error } = z.string().uuid().safeParse(id);
    if (!success) {
      throw new Error(error.message);
    }
    return await this.prisma.beer.findUnique({ where: { id } });
  };

  createBeer = async (payload: BeerInsert) => {
    return await this.prisma.beer.create({ data: payload });
  };

  updateBeer = async (id: string, payload: BeerUpdate) => {
    const { success, error } = z.string().uuid().safeParse(id);
    if (!success) {
      throw new Error(error.message);
    }
    return await this.prisma.beer.update({ where: { id }, data: payload });
  };

  deleteBeer = async (id: string) => {
    const { success, error } = z.string().uuid().safeParse(id);
    if (!success) {
      throw new Error(error.message);
    }
    return await this.prisma.beer.delete({ where: { id } });
  };
}
