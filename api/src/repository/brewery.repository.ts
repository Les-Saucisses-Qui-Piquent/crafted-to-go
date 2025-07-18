import type { PrismaClient } from "@prisma/client";
import { IBrewery, type BreweryInsert, type BreweryUpdate } from "../interfaces/IBrewery";

export default class BreweryRepository implements IBrewery {
  constructor(private prisma: PrismaClient) {}

  async getBreweries() {
    const breweries = await this.prisma.brewery.findMany();
    return breweries;
  }

  async getBrewery(id: string) {
    const brewery = await this.prisma.brewery.findUnique({ where: { id } });

    return brewery;
  }

  async createBrewery(payload: BreweryInsert) {
    const brewery = await this.prisma.brewery.create({
      data: payload,
    });

    return brewery;
  }

  async updateBrewery(id: string, payload: BreweryUpdate) {
    const brewery = await this.prisma.brewery.update({
      where: { id },
      data: payload,
    });

    return brewery;
  }

  async deleteBrewery(id: string) {
    const brewery = await this.prisma.brewery.delete({ where: { id } });
    return brewery;
  }
}
