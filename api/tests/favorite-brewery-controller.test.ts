import { describe, it, expect, vi, beforeEach } from "vitest";
import mockedPrisma from "../libs/__mocks__/prisma";
import type { favorite_brewery } from "@prisma/client";
import FavoriteBreweryController from "../src/controllers/favorite-brewery.controller";
import { mockedReply, mockRequest } from "../utils/mock-fastify";
import { FavoriteBreweryInsert, FavoriteBreweryUpdate } from "../src/interfaces/IFavoriteBrewery";

describe("🏭 FavoriteBrewery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve all favorite breweries for a user", async () => {
    const testFavorites: favorite_brewery[] = [
      {
        id: "fav-1",
        brewery_id: "brewery-1",
        user_id: "user-1",
        liked_at: new Date("2025-01-01"),
      },
    ];
    mockedPrisma.favorite_brewery.findMany.mockResolvedValue(testFavorites);

    const userId = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { userId: string } }>({ params: { userId } });

    await FavoriteBreweryController.getFavoriteBreweries(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testFavorites);
  });

  it("should throw an error with wrong userId : invalid uuid", async () => {
    const userId = "user-1";
    const request = mockRequest<{ Params: { userId: string } }>({ params: { userId } });

    await FavoriteBreweryController.getFavoriteBreweries(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(400);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Invalid uuid" });
  });

  it("should return 404 and clientMessage when favorite breweries not found", async () => {
    mockedPrisma.favorite_brewery.findMany.mockResolvedValueOnce([]);

    const userId = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { userId: string } }>({ params: { userId } });

    await FavoriteBreweryController.getFavoriteBreweries(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "FavoriteBrewery not found" });
  });

  it("should create a favorite brewery", async () => {
    const favoriteInsert: FavoriteBreweryInsert = {
      brewery: { connect: { id: "brewery-1" } },
      user: { connect: { id: "user-1" } },
      liked_at: new Date("2025-01-01"),
    };

    const insertResponse: favorite_brewery = {
      id: "fav-1",
      brewery_id: "brewery-1",
      user_id: "user-1",
      liked_at: new Date("2025-01-01"),
    };

    mockedPrisma.favorite_brewery.create.mockResolvedValue(insertResponse);

    const request = mockRequest<{ Body: FavoriteBreweryInsert }>({ body: favoriteInsert });

    await FavoriteBreweryController.createFavoriteBrewery(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(insertResponse);
  });

  it("should update a favorite brewery", async () => {
    const id = "123e4567-e89b-12d3-a456-426614174000";
    const updatePayload: FavoriteBreweryUpdate = {
      brewery: { connect: { id: "brewery-2" } },
    };

    const updateResponse: favorite_brewery = {
      id,
      brewery_id: "brewery-2",
      user_id: "user-1",
      liked_at: new Date("2025-01-01"),
    };

    mockedPrisma.favorite_brewery.update.mockResolvedValue(updateResponse);

    const request = mockRequest<{ Params: { id: string }; Body: FavoriteBreweryUpdate }>({
      params: { id },
      body: updatePayload,
    });

    await FavoriteBreweryController.updateFavoriteBrewery(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(updateResponse);
  });

  it("should delete a favorite brewery", async () => {
    const id = "123e4567-e89b-12d3-a456-426614174000";
    const deleteResponse: favorite_brewery = {
      id,
      brewery_id: "brewery-1",
      user_id: "user-1",
      liked_at: new Date("2025-01-01"),
    };

    mockedPrisma.favorite_brewery.delete.mockResolvedValue(deleteResponse);

    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await FavoriteBreweryController.deleteFavoriteBrewery(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(deleteResponse);
  });
});
