import type { PrismaClient } from "@prisma/client";
import { IBeer, type BeerInsert, type BeerUpdate } from "../interfaces/IBeer";

export default class BeerRepository implements IBeer {
  constructor(private prisma: PrismaClient) {}

  getBeers = async () => {
    return await this.prisma.beer.findMany({
      include: {
        beer_style: {
          select: {
            label: true,
          },
        },
        brewery: {
          select: {
            name: true,
          },
        },
        beer_color: {
          select: {
            label: true,
          },
        },
      },
    });
  };

  getBeersByBrewery = async (breweryId: string) => {
    return await this.prisma.beer.findMany({
      where: { brewery_id: breweryId },
    });
  };

  getBeer = async (id: string) => {
    return await this.prisma.beer.findUnique({
      where: { id },
      include: {
        beer_style: {
          select: {
            label: true,
          },
        },
        brewery: {
          select: {
            name: true,
          },
        },
        beer_color: {
          select: {
            label: true,
          },
        },
      },
    });
  };

  createBeer = async (payload: BeerInsert) => {
    return await this.prisma.beer.create({ data: payload });
  };

  updateBeer = async (id: string, payload: BeerUpdate) => {
    return await this.prisma.beer.update({ where: { id }, data: payload });
  };

  deleteBeer = async (id: string) => {
    await this.prisma.order_detail.deleteMany({
      where: { beer_id: id },
    });

    await this.prisma.favorite_beer.deleteMany({
      where: { beer_id: id },
    });

    return await this.prisma.beer.delete({ where: { id } });
  };
}
