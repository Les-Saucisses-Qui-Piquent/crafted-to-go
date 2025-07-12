import { describe, it, expect, vi, beforeEach } from "vitest";
import mockedPrisma from "../libs/__mocks__/prisma";
import type { beer_color } from "@prisma/client";
import BeerColorController from "../src/controllers/beer-color.controller";
import { mockedReply, mockRequest } from "../utils/mock-fastify";
import { BeerColorInsert, BeerColorUpdate } from "../src/interfaces/IBeerColor";

describe("🎨 BeerColor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve all beer colors", async () => {
    const testColors: beer_color[] = [
      {
        id: "color-1",
        label: "Blonde",
        beer_levels: [1, 2],
      },
    ];
    mockedPrisma.beer_color.findMany.mockResolvedValue(testColors);
    const request = mockRequest();

    await BeerColorController.getBeerColors(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testColors);
  });

  it("should throw an error with wrong id : invalid uuid", async () => {
    const id = "color-1";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await BeerColorController.getBeerColor(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(400);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Invalid uuid" });
  });

  it("should retrieve a specific beer color", async () => {
    const testColor: beer_color = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      label: "Blonde",
      beer_levels: [1, 2],
    };
    mockedPrisma.beer_color.findUnique.mockResolvedValueOnce(testColor);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await BeerColorController.getBeerColor(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testColor);
  });

  it("should return 404 and clientMessage when beer color not found", async () => {
    const id = "123e4567-e89b-12d3-a456-426614174000";
    mockedPrisma.beer_color.findUnique.mockResolvedValue(null);

    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });
    await BeerColorController.getBeerColor(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "BeerColor not found" });
  });

  it("should create a beer color", async () => {
    const colorInsert: BeerColorInsert = {
      label: "Blonde",
      beer_levels: [1, 2],
    };
    const insertResponse = {
      id: "color-1",
      beer_levels: [1, 2],
    };
    mockedPrisma.beer_color.create.mockResolvedValue({
      ...colorInsert,
      ...insertResponse,
    });

    const request = mockRequest<{ Body: BeerColorInsert }>({
      body: {
        ...colorInsert,
      },
    });

    await BeerColorController.createBeerColor(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith({
      ...colorInsert,
      ...insertResponse,
    });
  });

  it("should update an existing beer color", async () => {
    const testColor: beer_color = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      label: "Blonde",
      beer_levels: [1, 2],
    };

    mockedPrisma.beer_color.findUnique.mockResolvedValue(testColor);
    mockedPrisma.beer_color.update.mockResolvedValue({ ...testColor, label: "Ambrée" });

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const payload: BeerColorUpdate = {
      label: "Ambrée",
    };
    const request = mockRequest<{ Params: { id: string }; Body: BeerColorUpdate }>({
      params: { id },
      body: payload,
    });

    await BeerColorController.updateBeerColor(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith({ ...testColor, label: "Ambrée" });
  });

  it("should throw an error when updating a non-existing beer color", async () => {
    mockedPrisma.beer_color.findUnique.mockResolvedValue(null);
    const id = "123e4567-e89b-12d3-a456-426614174000";
    const payload: BeerColorUpdate = {
      label: "Ambrée",
    };

    const request = mockRequest<{ Params: { id: string }; Body: BeerColorUpdate }>({
      params: { id },
      body: payload,
    });

    await BeerColorController.updateBeerColor(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "BeerColor not found" });
  });

  it("should delete a beer color", async () => {
    const testColor: beer_color = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      label: "Blonde",
      beer_levels: [1, 2],
    };

    mockedPrisma.beer_color.findUnique.mockResolvedValue(testColor);
    mockedPrisma.beer_color.delete.mockResolvedValue(testColor);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await BeerColorController.deleteBeerColor(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testColor);
  });

  it("shouldn't delete a non-existing beer color", async () => {
    mockedPrisma.beer_color.findUnique.mockResolvedValue(null);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await BeerColorController.deleteBeerColor(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "BeerColor not found" });
  });
});
