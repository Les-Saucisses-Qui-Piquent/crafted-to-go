import type { PrismaClient } from "@prisma/client";
import { IBeerStyle, type BeerStyleInsert, type BeerStyleUpdate } from "../interfaces/IBeerStyle";

export default class BeerStyleRepository implements IBeerStyle {
  constructor(private prisma: PrismaClient) {}

  getBeerStyles = async () => {
    return await this.prisma.beer_style.findMany();
  };

  getBeerStyle = async (id: string) => {
    return await this.prisma.beer_style.findUnique({ where: { id } });
  };

  createBeerStyle = async (payload: BeerStyleInsert) => {
    return await this.prisma.beer_style.create({ data: payload });
  };

  updateBeerStyle = async (id: string, payload: BeerStyleUpdate) => {
    return await this.prisma.beer_style.update({ where: { id }, data: payload });
  };

  deleteBeerStyle = async (id: string) => {
    return await this.prisma.beer_style.delete({ where: { id } });
  };
}
