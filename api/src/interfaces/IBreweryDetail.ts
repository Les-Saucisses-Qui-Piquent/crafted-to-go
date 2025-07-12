import { type brewery_detail, Prisma } from "@prisma/client";

export type BreweryDetailInsert = Prisma.brewery_detailCreateInput;
export type BreweryDetailUpdate = Prisma.brewery_detailUpdateInput;

export interface IBreweryDetail {
  getBreweryDetails: () => Promise<brewery_detail[]>;
  getBreweryDetail: (id: string) => Promise<brewery_detail | null>;
  createBreweryDetail: (payload: BreweryDetailInsert) => Promise<brewery_detail>;
  updateBreweryDetail: (id: string, payload: BreweryDetailUpdate) => Promise<brewery_detail>;
  deleteBreweryDetail: (id: string) => Promise<brewery_detail>;
}
