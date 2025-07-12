import type { PrismaClient } from "@prisma/client";
import {
  IFavoriteBrewery,
  type FavoriteBreweryInsert,
  type FavoriteBreweryUpdate,
} from "../interfaces/IFavoriteBrewery";

export default class FavoriteBreweryRepository implements IFavoriteBrewery {
  constructor(private prisma: PrismaClient) {}

  getFavoriteBreweries = async (userId: string) => {
    return await this.prisma.favorite_brewery.findMany({ where: { user_id: userId } });
  };

  createFavoriteBrewery = async (payload: FavoriteBreweryInsert) => {
    return await this.prisma.favorite_brewery.create({ data: payload });
  };

  updateFavoriteBrewery = async (id: string, payload: FavoriteBreweryUpdate) => {
    return await this.prisma.favorite_brewery.update({ where: { id }, data: payload });
  };

  deleteFavoriteBrewery = async (id: string) => {
    return await this.prisma.favorite_brewery.delete({ where: { id } });
  };
}
