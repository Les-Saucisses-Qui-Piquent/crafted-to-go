import { type address, Prisma } from "@prisma/client";

export type AddressInsert = Prisma.addressCreateInput;
export type AddressUpdate = Prisma.addressUpdateInput;

export interface IAddress {
  getAddresses: () => Promise<address[]>;
  getAddress: (id: string) => Promise<address | null>;
  createAddress: (payload: AddressInsert) => Promise<address>;
  updateAddress: (id: string, payload: AddressUpdate) => Promise<address>;
  deleteAddress: (id: string) => Promise<address>;
}
