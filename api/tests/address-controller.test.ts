import { describe, it, expect, vi, beforeEach } from "vitest";
import mockedPrisma from "../libs/__mocks__/prisma";
import type { address } from "@prisma/client";
import AddressController from "../src/controllers/address.controller";
import { mockedReply, mockRequest } from "../utils/mock-fastify";
import { AddressInsert, AddressUpdate } from "../src/interfaces/IAddress";

describe("📮 Address", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve all addresses", async () => {
    const testAddresses: address[] = [
      {
        id: "address-1",
        line_1: "123 Main St",
        line_2: null,
        postal_code: "12345",
        city: "Test City",
        country: "Test Country",
        updated_at: new Date("2025-01-01"),
        created_at: new Date("2025-01-01"),
      },
    ];
    mockedPrisma.address.findMany.mockResolvedValue(testAddresses);

    const request = mockRequest();
    await AddressController.getAddresses(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testAddresses);
  });

  it("should throw an error with wrong id : invalid uuid", async () => {
    const id = "address-1";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await AddressController.getAddress(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(400);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Invalid uuid" });
  });

  it("should retrieve a specific address", async () => {
    const testAddress: address = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      line_1: "123 Main St",
      line_2: null,
      postal_code: "12345",
      city: "Test City",
      country: "Test Country",
      updated_at: new Date("2025-01-01"),
      created_at: new Date("2025-01-01"),
    };
    mockedPrisma.address.findUnique.mockResolvedValueOnce(testAddress);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await AddressController.getAddress(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testAddress);
  });

  it("should return 404 and clientMessage when address not found", async () => {
    const id = "123e4567-e89b-12d3-a456-426614174000";

    mockedPrisma.address.findUnique.mockResolvedValue(null);
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await AddressController.getAddress(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Address not found" });
  });

  it("should create an address", async () => {
    const addressInsert: AddressInsert = {
      line_1: "123 Main St",
      line_2: null,
      postal_code: "12345",
      city: "Test City",
      country: "Test Country",
    };

    const insertResponse = {
      id: "address-1",
      updated_at: new Date("2025-01-01"),
      created_at: new Date("2025-01-01"),
      line_2: null,
    };

    mockedPrisma.address.create.mockResolvedValue({
      ...addressInsert,
      ...insertResponse,
    });

    const request = mockRequest<{ Body: AddressInsert }>({
      body: {
        ...addressInsert,
      },
    });

    await AddressController.createAddress(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith({
      ...addressInsert,
      ...insertResponse,
    });
  });

  it("should update an existing address", async () => {
    const testAddress: address = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      line_1: "123 Main St",
      line_2: null,
      postal_code: "12345",
      city: "Test City",
      country: "Test Country",
      updated_at: new Date("2025-01-01"),
      created_at: new Date("2025-01-01"),
    };
    mockedPrisma.address.findUnique.mockResolvedValue(testAddress);
    mockedPrisma.address.update.mockResolvedValue({ ...testAddress, city: "New City" });

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const payload: AddressUpdate = {
      city: "New City",
    };

    const request = mockRequest<{ Params: { id: string }; Body: AddressUpdate }>({
      params: { id },
      body: payload,
    });

    await AddressController.updateAddress(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith({ ...testAddress, city: "New City" });
  });

  it("should throw an error when updating a non-existing address", async () => {
    mockedPrisma.address.findUnique.mockResolvedValue(null);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const payload: AddressUpdate = {
      city: "New City",
    };

    const request = mockRequest<{ Params: { id: string }; Body: AddressUpdate }>({
      params: { id },
      body: payload,
    });

    await AddressController.updateAddress(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Address not found" });
  });

  it("should delete an address", async () => {
    const testAddress: address = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      line_1: "123 Main St",
      line_2: null,
      postal_code: "12345",
      city: "Test City",
      country: "Test Country",
      updated_at: new Date("2025-01-01"),
      created_at: new Date("2025-01-01"),
    };
    mockedPrisma.address.findUnique.mockResolvedValue(testAddress);
    mockedPrisma.address.delete.mockResolvedValue(testAddress);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await AddressController.deleteAddress(request, mockedReply);
    expect(mockedReply.send).toHaveBeenCalledWith(testAddress);
  });

  it("shouldn't delete a non-existing address", async () => {
    mockedPrisma.address.findUnique.mockResolvedValue(null);
    const id = "123e4567-e89b-12d3-a456-426614174000";

    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });
    await AddressController.deleteAddress(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Address not found" });
  });
});
