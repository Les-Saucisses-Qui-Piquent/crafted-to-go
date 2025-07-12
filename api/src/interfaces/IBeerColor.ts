import { type beer_color, Prisma } from "@prisma/client";

export type BeerColorInsert = Prisma.beer_colorCreateInput;
export type BeerColorUpdate = Prisma.beer_colorUpdateInput;

export interface IBeerColor {
  getBeerColors: () => Promise<beer_color[]>;
  getBeerColor: (id: string) => Promise<beer_color | null>;
  createBeerColor: (payload: BeerColorInsert) => Promise<beer_color>;
  updateBeerColor: (id: string, payload: BeerColorUpdate) => Promise<beer_color>;
  deleteBeerColor: (id: string) => Promise<beer_color>;
}
