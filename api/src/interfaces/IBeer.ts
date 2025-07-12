import { type beer, Prisma } from "@prisma/client";

export type BeerInsert = Prisma.beerCreateInput;
export type BeerUpdate = Prisma.beerUpdateInput;

export interface IBeer {
  getBeers: () => Promise<beer[]>;
  getBeer: (id: string) => Promise<beer | null>;
  createBeer: (payload: BeerInsert) => Promise<beer>;
  updateBeer: (id: string, payload: BeerUpdate) => Promise<beer>;
  deleteBeer: (id: string) => Promise<beer>;
}
