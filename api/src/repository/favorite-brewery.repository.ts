import type { PrismaClient } from "@prisma/client";
import {
  IFavoriteBrewery,
  type FavoriteBreweryInsert,
  type FavoriteBreweryUpdate,
} from "../interfaces/IFavoriteBrewery";
import z from "zod";

export default class FavoriteBreweryRepository implements IFavoriteBrewery {
  constructor(private prisma: PrismaClient) {}

  getFavoriteBreweries = async (userId: string) => {
    const { success, error } = z.string().uuid().safeParse(userId);
    if (!success) {
      throw new Error(error.message);
    }
    return await this.prisma.favorite_brewery.findMany({ where: { user_id: userId } });
  };

  createFavoriteBrewery = async (payload: FavoriteBreweryInsert) => {
    return await this.prisma.favorite_brewery.create({ data: payload });
  };

  updateFavoriteBrewery = async (id: string, payload: FavoriteBreweryUpdate) => {
    const { success, error } = z.string().uuid().safeParse(id);
    if (!success) {
      throw new Error(error.message);
    }
    return await this.prisma.favorite_brewery.update({ where: { id }, data: payload });
  };

  deleteFavoriteBrewery = async (id: string) => {
    const { success, error } = z.string().uuid().safeParse(id);
    if (!success) {
      throw new Error(error.message);
    }
    return await this.prisma.favorite_brewery.delete({ where: { id } });
  };
}
