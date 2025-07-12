import type { PrismaClient } from "@prisma/client";
import {
  IFavoriteBeer,
  type FavoriteBeerInsert,
  type FavoriteBeerUpdate,
} from "../interfaces/IFavoriteBeer";

export default class FavoriteBeerRepository implements IFavoriteBeer {
  constructor(private prisma: PrismaClient) {}

  getFavoriteBeers = async (userId: string) => {
    return await this.prisma.favorite_beer.findMany({ where: { user_id: userId } });
  };

  createFavoriteBeer = async (payload: FavoriteBeerInsert) => {
    return await this.prisma.favorite_beer.create({ data: payload });
  };

  updateFavoriteBeer = async (id: string, payload: FavoriteBeerUpdate) => {
    return await this.prisma.favorite_beer.update({ where: { id }, data: payload });
  };

  deleteFavoriteBeer = async (id: string) => {
    return await this.prisma.favorite_beer.delete({ where: { id } });
  };
}
