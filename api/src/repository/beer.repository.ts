import type { PrismaClient } from "@prisma/client";
import { IBeer, type BeerInsert, type BeerUpdate } from "../interfaces/IBeer";

export default class BeerRepository implements IBeer {
  constructor(private prisma: PrismaClient) {}

  getBeers = async () => {
    return await this.prisma.beer.findMany();
  };

  getBeer = async (id: string) => {
    return await this.prisma.beer.findUnique({ where: { id } });
  };

  createBeer = async (payload: BeerInsert) => {
    return await this.prisma.beer.create({ data: payload });
  };

  updateBeer = async (id: string, payload: BeerUpdate) => {
    return await this.prisma.beer.update({ where: { id }, data: payload });
  };

  deleteBeer = async (id: string) => {
    return await this.prisma.beer.delete({ where: { id } });
  };
}
