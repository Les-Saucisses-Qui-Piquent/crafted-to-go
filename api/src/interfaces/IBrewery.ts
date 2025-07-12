import { type brewery, Prisma } from "@prisma/client";

export type BreweryInsert = Prisma.breweryCreateInput;
export type BreweryUpdate = Prisma.breweryUpdateInput;

export interface IBrewery {
  getBreweries: () => Promise<brewery[]>;
  getBrewery: (id: string) => Promise<brewery | null>;
  createBrewery: (payload: BreweryInsert) => Promise<brewery>;
  updateBrewery: (id: string, payload: BreweryUpdate) => Promise<brewery>;
  deleteBrewery: (id: string) => Promise<brewery>;
}
