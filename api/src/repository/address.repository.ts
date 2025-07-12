import type { PrismaClient } from "@prisma/client";
import { IAddress, type AddressInsert, type AddressUpdate } from "../interfaces/IAddress";

export default class AddressRepository implements IAddress {
  constructor(private prisma: PrismaClient) {}

  getAddresses = async () => {
    return await this.prisma.address.findMany();
  };

  getAddress = async (id: string) => {
    return await this.prisma.address.findUnique({ where: { id } });
  };

  createAddress = async (payload: AddressInsert) => {
    return await this.prisma.address.create({ data: payload });
  };

  updateAddress = async (id: string, payload: AddressUpdate) => {
    return await this.prisma.address.update({ where: { id }, data: payload });
  };

  deleteAddress = async (id: string) => {
    return await this.prisma.address.delete({ where: { id } });
  };
}
