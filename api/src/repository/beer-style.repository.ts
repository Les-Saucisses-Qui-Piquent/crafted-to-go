import type { PrismaClient } from "@prisma/client";
import { IBeerStyle, type BeerStyleInsert, type BeerStyleUpdate } from "../interfaces/IBeerStyle";
import z from "zod";

const BeerStyleRepository: new (prisma: PrismaClient) => IBeerStyle = class BeerStyleRepository
  implements IBeerStyle
{
  constructor(private prisma: PrismaClient) {}

  getBeerStyles = async () => {
    return await this.prisma.beer_style.findMany();
  };

  getBeerStyle = async (id: string) => {
    const { success, error } = z.string().uuid().safeParse(id);
    if (!success) {
      throw new Error(error.message);
    }
    return await this.prisma.beer_style.findUnique({ where: { id } });
  };

  createBeerStyle = async (payload: BeerStyleInsert) => {
    return await this.prisma.beer_style.create({ data: payload });
  };

  updateBeerStyle = async (id: string, payload: BeerStyleUpdate) => {
    const { success, error } = z.string().uuid().safeParse(id);
    if (!success) {
      throw new Error(error.message);
    }
    return await this.prisma.beer_style.update({ where: { id }, data: payload });
  };

  deleteBeerStyle = async (id: string) => {
    const { success, error } = z.string().uuid().safeParse(id);
    if (!success) {
      throw new Error(error.message);
    }
    return await this.prisma.beer_style.delete({ where: { id } });
  };
};

export default BeerStyleRepository;
