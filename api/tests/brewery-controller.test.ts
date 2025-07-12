import { describe, it, expect, vi, beforeEach } from "vitest";
import mockedPrisma from "../libs/__mocks__/prisma";
import type { brewery } from "@prisma/client";
import BreweryController from "../src/controllers/brewery.controller";
import { mockedReply, mockRequest } from "../utils/mock-fastify";
import { BreweryInsert, BreweryUpdate } from "../src/interfaces/IBrewery";

describe("Brewery Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should retrieve all breweries", async () => {
    const testBreweries: brewery[] = [
      {
        id: "brewery-1",
        name: "Test Brewery",
        created_at: new Date("2025-01-01"),
        updated_at: new Date("2025-01-01"),
        address_id: "address-1",
        RIB: "1234567890",
        siren: "1234567890",
        owner_id: "user-1",
      },
    ];

    mockedPrisma.brewery.findMany.mockResolvedValue(testBreweries);

    const request = mockRequest();

    await BreweryController.getBreweries(request, mockedReply);
    expect(mockedReply.send).toHaveBeenCalledWith(testBreweries);
  });

  it("should throw an error with wrong id : invalid uuid", async () => {
    const id = "brewery-1";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await BreweryController.getBrewery(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(400);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Invalid uuid" });
  });

  it("should retrieve a specific brewery", async () => {
    const testBrewery: brewery = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Test Brewery",
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      address_id: "address-1",
      RIB: "1234567890",
      siren: "1234567890",
      owner_id: "user-1",
    };

    mockedPrisma.brewery.findUnique.mockResolvedValueOnce(testBrewery);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await BreweryController.getBrewery(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testBrewery);
  });

  it("should return 404 and clientMessage when brewery not found", async () => {
    const id = "123e4567-e89b-12d3-a456-426614174000";
    mockedPrisma.brewery.findUnique.mockResolvedValue(null);

    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await BreweryController.getBrewery(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Brewery not found" });
  });

  it("should create a brewery", async () => {
    const breweryInsert: BreweryInsert = {
      name: "Test Brewery",
      RIB: "1234567890",
      siren: "1234567890",
      address: { connect: { id: "address-1" } },
      user: { connect: { id: "user-1" } },
    };

    const insertResponse = {
      id: "brewery-1",
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      address_id: "address-1",
      owner_id: "user-1",
    };
    mockedPrisma.brewery.create.mockResolvedValue({
      ...breweryInsert,
      ...insertResponse,
    });

    const request = mockRequest<{ Body: BreweryInsert }>({
      body: {
        ...breweryInsert,
      },
    });

    await BreweryController.createBrewery(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith({
      ...breweryInsert,
      ...insertResponse,
    });
  });

  it("should update an existing brewery", async () => {
    const testBrewery: brewery = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Test Brewery",
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      address_id: "address-1",
      RIB: "1234567890",
      siren: "1234567890",
      owner_id: "user-1",
    };
    mockedPrisma.brewery.findUnique.mockResolvedValue(testBrewery);
    mockedPrisma.brewery.update.mockResolvedValue({ ...testBrewery, RIB: "0987654321" });

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const payload: BreweryUpdate = {
      RIB: "0987654321",
    };
    const request = mockRequest<{ Params: { id: string }; Body: BreweryUpdate }>({
      params: { id },
      body: payload,
    });

    await BreweryController.updateBrewery(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith({ ...testBrewery, RIB: "0987654321" });
  });

  it("should throw an error when updating a non-existing brewery", async () => {
    const testBrewery: brewery = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Test Brewery",
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      address_id: "address-1",
      RIB: "1234567890",
      siren: "1234567890",
      owner_id: "user-1",
    };
    mockedPrisma.brewery.update.mockResolvedValue({ ...testBrewery, RIB: "0987654321" });

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const payload: BreweryUpdate = {
      RIB: "0987654321",
    };
    const request = mockRequest<{ Params: { id: string }; Body: BreweryUpdate }>({
      params: { id },
      body: payload,
    });

    await BreweryController.updateBrewery(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Brewery not found" });
  });

  it("should delete a brewery", async () => {
    const testBrewery: brewery = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Test Brewery",
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      address_id: "address-1",
      RIB: "1234567890",
      siren: "1234567890",
      owner_id: "user-1",
    };
    mockedPrisma.brewery.findUnique.mockResolvedValue(testBrewery);
    mockedPrisma.brewery.delete.mockResolvedValue(testBrewery);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await BreweryController.deleteBrewery(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testBrewery);
  });

  it("shouldn't delete a non-existing brewery", async () => {
    const testBrewery: brewery = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Test Brewery",
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      address_id: "address-1",
      RIB: "1234567890",
      siren: "1234567890",
      owner_id: "user-1",
    };
    mockedPrisma.brewery.delete.mockResolvedValue(testBrewery);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await BreweryController.deleteBrewery(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Brewery not found" });
  });
});
