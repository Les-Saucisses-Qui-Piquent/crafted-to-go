import { describe, it, expect, vi, beforeEach } from "vitest";
import mockedPrisma from "../libs/__mocks__/prisma";
import type { brewery_detail } from "@prisma/client";
import BreweryDetailController from "../src/controllers/brewery-detail.controller";
import { mockedReply, mockRequest } from "../utils/mock-fastify";
import { BreweryDetailInsert, BreweryDetailUpdate } from "../src/interfaces/IBreweryDetail";

describe("🏭 BreweryDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve all brewery details", async () => {
    const testDetails: brewery_detail[] = [
      {
        id: "detail-1",
        brewery_id: "brewery-1",
        has_taproom: true,
        image: "img.png",
        logo: "logo.png",
        description: "desc",
        phone_number: "1234567890",
        email: "brewery@example.com",
        created_at: new Date("2025-01-01"),
        updated_at: new Date("2025-01-01"),
        taproom_hours: null,
        opening_hours: {},
        social_links: [],
      },
    ];
    mockedPrisma.brewery_detail.findMany.mockResolvedValue(testDetails);

    const request = mockRequest();

    await BreweryDetailController.getBreweryDetails(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testDetails);
  });

  it("should throw an error with wrong id : invalid uuid", async () => {
    const id = "detail-1";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await BreweryDetailController.getBreweryDetail(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(400);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Invalid uuid" });
  });

  it("should retrieve a specific brewery detail", async () => {
    const testDetail: brewery_detail = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      brewery_id: "brewery-1",
      has_taproom: true,
      image: "img.png",
      logo: "logo.png",
      description: "desc",
      phone_number: "1234567890",
      email: "brewery@example.com",
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      taproom_hours: null,
      opening_hours: {},
      social_links: [],
    };
    mockedPrisma.brewery_detail.findUnique.mockResolvedValueOnce(testDetail);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await BreweryDetailController.getBreweryDetail(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testDetail);
  });

  it("should return 404 and clientMessage when brewery detail not found", async () => {
    mockedPrisma.brewery_detail.findUnique.mockResolvedValue(null);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await BreweryDetailController.getBreweryDetail(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "BreweryDetail not found" });
  });

  it("should create a brewery detail", async () => {
    const detailInsert: BreweryDetailInsert = {
      brewery: { connect: { id: "brewery-1" } },
      has_taproom: true,
      image: "img.png",
      logo: "logo.png",
      description: "desc",
      phone_number: "1234567890",
      email: "brewery@example.com",
      opening_hours: {},
      social_links: [],
    };

    const insertResponse: brewery_detail = {
      id: "detail-1",
      brewery_id: "brewery-1",
      has_taproom: true,
      image: "img.png",
      logo: "logo.png",
      description: "desc",
      phone_number: "1234567890",
      email: "brewery@example.com",
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      taproom_hours: null,
      opening_hours: {},
      social_links: [],
    };
    mockedPrisma.brewery_detail.create.mockResolvedValue(insertResponse);

    const request = mockRequest<{ Body: BreweryDetailInsert }>({ body: detailInsert });

    await BreweryDetailController.createBreweryDetail(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(insertResponse);
  });

  it("should update an existing brewery detail", async () => {
    const testDetail: brewery_detail = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      brewery_id: "brewery-1",
      has_taproom: true,
      image: "img.png",
      logo: "logo.png",
      description: "desc",
      phone_number: "1234567890",
      email: "brewery@example.com",
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      taproom_hours: null,
      opening_hours: {},
      social_links: [],
    };

    mockedPrisma.brewery_detail.findUnique.mockResolvedValue(testDetail);
    mockedPrisma.brewery_detail.update.mockResolvedValue({ ...testDetail, has_taproom: false });

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const payload: BreweryDetailUpdate = {
      has_taproom: false,
    };

    const request = mockRequest<{ Params: { id: string }; Body: BreweryDetailUpdate }>({
      params: { id },
      body: payload,
    });

    await BreweryDetailController.updateBreweryDetail(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith({ ...testDetail, has_taproom: false });
  });

  it("should throw an error when updating a non-existing brewery detail", async () => {
    mockedPrisma.brewery_detail.findUnique.mockResolvedValue(null);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const payload: BreweryDetailUpdate = {
      has_taproom: false,
    };

    const request = mockRequest<{ Params: { id: string }; Body: BreweryDetailUpdate }>({
      params: { id },
      body: payload,
    });

    await BreweryDetailController.updateBreweryDetail(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "BreweryDetail not found" });
  });

  it("should delete a brewery detail", async () => {
    const testDetail: brewery_detail = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      brewery_id: "brewery-1",
      has_taproom: true,
      image: "img.png",
      logo: "logo.png",
      description: "desc",
      phone_number: "1234567890",
      email: "brewery@example.com",
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      taproom_hours: null,
      opening_hours: {},
      social_links: [],
    };

    mockedPrisma.brewery_detail.findUnique.mockResolvedValue(testDetail);
    mockedPrisma.brewery_detail.delete.mockResolvedValue(testDetail);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await BreweryDetailController.deleteBreweryDetail(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testDetail);
  });

  it("shouldn't delete a non-existing brewery detail", async () => {
    mockedPrisma.brewery_detail.findUnique.mockResolvedValue(null);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await BreweryDetailController.deleteBreweryDetail(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "BreweryDetail not found" });
  });
});
