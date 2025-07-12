import type { PrismaClient } from "@prisma/client";
import { IBeerColor, type BeerColorInsert, type BeerColorUpdate } from "../interfaces/IBeerColor";

export default class BeerColorRepository implements IBeerColor {
  constructor(private prisma: PrismaClient) {}

  getBeerColors = async () => {
    return await this.prisma.beer_color.findMany();
  };

  getBeerColor = async (id: string) => {
    return await this.prisma.beer_color.findUnique({ where: { id } });
  };

  createBeerColor = async (payload: BeerColorInsert) => {
    return await this.prisma.beer_color.create({ data: payload });
  };

  updateBeerColor = async (id: string, payload: BeerColorUpdate) => {
    return await this.prisma.beer_color.update({ where: { id }, data: payload });
  };

  deleteBeerColor = async (id: string) => {
    return await this.prisma.beer_color.delete({ where: { id } });
  };
}
