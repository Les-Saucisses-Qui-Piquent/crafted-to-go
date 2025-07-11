import { type beer_style, Prisma } from "@prisma/client";

export type BeerStyleInsert = Prisma.beer_styleCreateInput;
export type BeerStyleUpdate = Prisma.beer_styleUpdateInput;

export interface IBeerStyle {
  getBeerStyles: () => Promise<beer_style[]>;
  getBeerStyle: (id: string) => Promise<beer_style | null>;
  createBeerStyle: (payload: BeerStyleInsert) => Promise<beer_style>;
  updateBeerStyle: (id: string, payload: BeerStyleUpdate) => Promise<beer_style>;
  deleteBeerStyle: (id: string) => Promise<beer_style>;
}
