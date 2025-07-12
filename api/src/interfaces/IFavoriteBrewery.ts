import { type favorite_brewery, Prisma } from "@prisma/client";

export type FavoriteBreweryInsert = Prisma.favorite_breweryCreateInput;
export type FavoriteBreweryUpdate = Prisma.favorite_breweryUpdateInput;

export interface IFavoriteBrewery {
  getFavoriteBreweries: (userId: string) => Promise<favorite_brewery[]>;
  createFavoriteBrewery: (payload: FavoriteBreweryInsert) => Promise<favorite_brewery>;
  updateFavoriteBrewery: (id: string, payload: FavoriteBreweryUpdate) => Promise<favorite_brewery>;
  deleteFavoriteBrewery: (id: string) => Promise<favorite_brewery>;
}
