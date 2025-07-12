import { type favorite_beer, Prisma } from "@prisma/client";

export type FavoriteBeerInsert = Prisma.favorite_beerCreateInput;
export type FavoriteBeerUpdate = Prisma.favorite_beerUpdateInput;

export interface IFavoriteBeer {
  getFavoriteBeers: (userId: string) => Promise<favorite_beer[]>;
  createFavoriteBeer: (payload: FavoriteBeerInsert) => Promise<favorite_beer>;
  updateFavoriteBeer: (id: string, payload: FavoriteBeerUpdate) => Promise<favorite_beer>;
  deleteFavoriteBeer: (id: string) => Promise<favorite_beer>;
}
