import { describe, it, expect, vi, beforeEach } from "vitest";
import mockedPrisma from "../libs/__mocks__/prisma";
import type { beer } from "@prisma/client";
import BeerController from "../src/controllers/beer.controller";
import { mockedReply, mockRequest } from "../utils/mock-fastify";
import { BeerInsert, BeerUpdate } from "../src/interfaces/IBeer";

describe("🍺 Beer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve all beers", async () => {
    const testBeers: beer[] = [
      {
        id: "beer-1",
        name: "Test Beer",
        image: "img.png",
        beer_color_id: "color-1",
        brewery_id: "brewery-1",
        abv_rate: 5.5,
        ibu_rate: 30,
        quantity: 100,
        price: 4.5,
        is_public: true,
        created_at: new Date("2025-01-01"),
        updated_at: new Date("2025-01-01"),
        beer_style_ids: "style-1",
      },
    ];
    mockedPrisma.beer.findMany.mockResolvedValue(testBeers);

    const request = mockRequest();

    await BeerController.getBeers(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testBeers);
  });

  it("should throw an error with wrong id : invalid uuid", async () => {
    const id = "beer-1";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await BeerController.getBeer(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(400);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Invalid uuid" });
  });

  it("should retrieve a specific beer", async () => {
    const testBeer: beer = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Test Beer",
      image: "img.png",
      beer_color_id: "color-1",
      brewery_id: "brewery-1",
      abv_rate: 5.5,
      ibu_rate: 30,
      quantity: 100,
      price: 4.5,
      is_public: true,
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      beer_style_ids: "style-1",
    };
    mockedPrisma.beer.findUnique.mockResolvedValueOnce(testBeer);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await BeerController.getBeer(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testBeer);
  });

  it("should return 404 and clientMessage when beer not found", async () => {
    mockedPrisma.beer.findUnique.mockResolvedValue(null);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await BeerController.getBeer(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Beer not found" });
  });

  it("should create a beer", async () => {
    const beerInsert: BeerInsert = {
      name: "Test Beer",
      image: "img.png",
      abv_rate: 5.5,
      ibu_rate: 30,
      quantity: 100,
      price: 4.5,
      is_public: true,
      beer_color: { connect: { id: "color-1" } },
      brewery: { connect: { id: "brewery-1" } },
      beer_style: { connect: { id: "style-1" } },
    };

    const insertResponse: beer = {
      id: "beer-1",
      name: "Test Beer",
      image: "img.png",
      beer_color_id: "color-1",
      brewery_id: "brewery-1",
      abv_rate: 5.5,
      ibu_rate: 30,
      quantity: 100,
      price: 4.5,
      is_public: true,
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      beer_style_ids: "style-1",
    };
    mockedPrisma.beer.create.mockResolvedValue(insertResponse);

    const request = mockRequest<{ Body: BeerInsert }>({ body: beerInsert });

    await BeerController.createBeer(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(insertResponse);
  });

  it("should update an existing beer", async () => {
    const testBeer: beer = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Test Beer",
      image: "img.png",
      beer_color_id: "color-1",
      brewery_id: "brewery-1",
      abv_rate: 5.5,
      ibu_rate: 30,
      quantity: 100,
      price: 4.5,
      is_public: true,
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      beer_style_ids: "style-1",
    };

    mockedPrisma.beer.findUnique.mockResolvedValue(testBeer);
    mockedPrisma.beer.update.mockResolvedValue({ ...testBeer, price: 5.0 });

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const payload: BeerUpdate = {
      price: 5.0,
    };

    const request = mockRequest<{ Params: { id: string }; Body: BeerUpdate }>({
      params: { id },
      body: payload,
    });

    await BeerController.updateBeer(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith({ ...testBeer, price: 5.0 });
  });

  it("should throw an error when updating a non-existing beer", async () => {
    mockedPrisma.beer.findUnique.mockResolvedValue(null);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const payload: BeerUpdate = {
      price: 5.0,
    };

    const request = mockRequest<{ Params: { id: string }; Body: BeerUpdate }>({
      params: { id },
      body: payload,
    });

    await BeerController.updateBeer(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Beer not found" });
  });

  it("should delete a beer", async () => {
    const testBeer: beer = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Test Beer",
      image: "img.png",
      beer_color_id: "color-1",
      brewery_id: "brewery-1",
      abv_rate: 5.5,
      ibu_rate: 30,
      quantity: 100,
      price: 4.5,
      is_public: true,
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      beer_style_ids: "style-1",
    };

    mockedPrisma.beer.findUnique.mockResolvedValue(testBeer);
    mockedPrisma.beer.delete.mockResolvedValue(testBeer);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await BeerController.deleteBeer(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testBeer);
  });

  it("shouldn't delete a non-existing beer", async () => {
    mockedPrisma.beer.findUnique.mockResolvedValue(null);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await BeerController.deleteBeer(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Beer not found" });
  });
});
