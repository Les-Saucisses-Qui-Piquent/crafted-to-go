import { describe, it, expect, vi, beforeEach } from "vitest";
import mockedPrisma from "../libs/__mocks__/prisma";
import type { favorite_beer } from "@prisma/client";
import FavoriteBeerController from "../src/controllers/favorite-beer.controller";
import { mockedReply, mockRequest } from "../utils/mock-fastify";
import { FavoriteBeerInsert, FavoriteBeerUpdate } from "../src/interfaces/IFavoriteBeer";

describe("🍺 FavoriteBeer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve all favorite beers for a user", async () => {
    const testFavorites: favorite_beer[] = [
      {
        id: "fav-1",
        beer_id: "beer-1",
        user_id: "user-1",
        liked_at: new Date("2025-01-01"),
      },
    ];
    mockedPrisma.favorite_beer.findMany.mockResolvedValue(testFavorites);

    const userId = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { userId: string } }>({ params: { userId } });

    await FavoriteBeerController.getFavoriteBeers(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testFavorites);
  });

  it("should throw an error with wrong userId : invalid uuid", async () => {
    const userId = "user-1";
    const request = mockRequest<{ Params: { userId: string } }>({ params: { userId } });

    await FavoriteBeerController.getFavoriteBeers(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(400);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Invalid uuid" });
  });

  it("should return 404 and clientMessage when favorite beers not found", async () => {
    mockedPrisma.favorite_beer.findMany.mockResolvedValueOnce([]);

    const userId = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { userId: string } }>({ params: { userId } });

    await FavoriteBeerController.getFavoriteBeers(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "FavoriteBeers not found" });
  });

  it("should create a favorite beer", async () => {
    const favoriteInsert: FavoriteBeerInsert = {
      beer: { connect: { id: "beer-1" } },
      user: { connect: { id: "user-1" } },
      liked_at: new Date("2025-01-01"),
    };

    const insertResponse: favorite_beer = {
      id: "fav-1",
      beer_id: "beer-1",
      user_id: "user-1",
      liked_at: new Date("2025-01-01"),
    };

    mockedPrisma.favorite_beer.create.mockResolvedValue(insertResponse);

    const request = mockRequest<{ Body: FavoriteBeerInsert }>({ body: favoriteInsert });

    await FavoriteBeerController.createFavoriteBeer(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(insertResponse);
  });

  it("should update a favorite beer", async () => {
    const id = "123e4567-e89b-12d3-a456-426614174000";
    const updatePayload: FavoriteBeerUpdate = {
      beer: { connect: { id: "beer-2" } },
    };

    const updateResponse: favorite_beer = {
      id,
      beer_id: "beer-2",
      user_id: "user-1",
      liked_at: new Date("2025-01-01"),
    };

    mockedPrisma.favorite_beer.update.mockResolvedValue(updateResponse);

    const request = mockRequest<{ Params: { id: string }; Body: FavoriteBeerUpdate }>({
      params: { id },
      body: updatePayload,
    });

    await FavoriteBeerController.updateFavoriteBeer(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(updateResponse);
  });

  it("should delete a favorite beer", async () => {
    const id = "123e4567-e89b-12d3-a456-426614174000";
    const deleteResponse: favorite_beer = {
      id,
      beer_id: "beer-1",
      user_id: "user-1",
      liked_at: new Date("2025-01-01"),
    };

    mockedPrisma.favorite_beer.delete.mockResolvedValue(deleteResponse);

    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await FavoriteBeerController.deleteFavoriteBeer(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(deleteResponse);
  });
});
