import { describe, it, expect, vi, beforeEach } from "vitest";
import mockedPrisma from "../libs/__mocks__/prisma";
import type { beer_style } from "@prisma/client";
import BeerStyleController from "../src/controllers/beer-style.controller";
import { mockedReply, mockRequest } from "../utils/mock-fastify";
import { BeerStyleInsert, BeerStyleUpdate } from "../src/interfaces/IBeerStyle";

describe("🕺 BeerStyle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve all beer styles", async () => {
    const testStyles: beer_style[] = [
      {
        id: "style-1",
        label: "IPA",
        beer_levels: [1, 2],
      },
    ];
    mockedPrisma.beer_style.findMany.mockResolvedValue(testStyles);
    const request = mockRequest();

    await BeerStyleController.getBeerStyles(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testStyles);
  });

  it("should throw an error with wrong id : invalid uuid", async () => {
    const id = "style-1";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await BeerStyleController.getBeerStyle(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(400);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Invalid uuid" });
  });

  it("should retrieve a specific beer style", async () => {
    const testStyle: beer_style = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      label: "IPA",
      beer_levels: [1, 2],
    };
    mockedPrisma.beer_style.findUnique.mockResolvedValueOnce(testStyle);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await BeerStyleController.getBeerStyle(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testStyle);
  });

  it("should return 404 and clientMessage when beer style not found", async () => {
    const id = "123e4567-e89b-12d3-a456-426614174000";
    mockedPrisma.beer_style.findUnique.mockResolvedValue(null);

    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });
    await BeerStyleController.getBeerStyle(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "BeerStyle not found" });
  });

  it("should create a beer style", async () => {
    const styleInsert: BeerStyleInsert = {
      label: "IPA",
      beer_levels: [1, 2],
    };
    const insertResponse = {
      id: "style-1",
      beer_levels: [1, 2],
    };
    mockedPrisma.beer_style.create.mockResolvedValue({
      ...styleInsert,
      ...insertResponse,
    });

    const request = mockRequest<{ Body: BeerStyleInsert }>({
      body: {
        ...styleInsert,
      },
    });

    await BeerStyleController.createBeerStyle(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith({
      ...styleInsert,
      ...insertResponse,
    });
  });

  it("should update an existing beer style", async () => {
    const testStyle: beer_style = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      label: "IPA",
      beer_levels: [1, 2],
    };

    mockedPrisma.beer_style.findUnique.mockResolvedValue(testStyle);
    mockedPrisma.beer_style.update.mockResolvedValue({ ...testStyle, label: "Stout" });

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const payload: BeerStyleUpdate = {
      label: "Stout",
    };

    const request = mockRequest<{ Params: { id: string }; Body: BeerStyleUpdate }>({
      params: { id },
      body: payload,
    });

    await BeerStyleController.updateBeerStyle(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith({ ...testStyle, label: "Stout" });
  });

  it("should throw an error when updating a non-existing beer style", async () => {
    mockedPrisma.beer_style.findUnique.mockResolvedValue(null);
    const id = "123e4567-e89b-12d3-a456-426614174000";
    const payload: BeerStyleUpdate = {
      label: "Stout",
    };

    const request = mockRequest<{ Params: { id: string }; Body: BeerStyleUpdate }>({
      params: { id },
      body: payload,
    });

    await BeerStyleController.updateBeerStyle(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "BeerStyle not found" });
  });

  it("should delete a beer style", async () => {
    const testStyle: beer_style = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      label: "IPA",
      beer_levels: [1, 2],
    };

    mockedPrisma.beer_style.findUnique.mockResolvedValue(testStyle);
    mockedPrisma.beer_style.delete.mockResolvedValue(testStyle);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await BeerStyleController.deleteBeerStyle(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testStyle);
  });

  it("shouldn't delete a non-existing beer style", async () => {
    mockedPrisma.beer_style.findUnique.mockResolvedValue(null);
    const id = "123e4567-e89b-12d3-a456-426614174000";

    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });
    await BeerStyleController.deleteBeerStyle(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "BeerStyle not found" });
  });
});
