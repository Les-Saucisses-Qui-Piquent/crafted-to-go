import { describe, it, expect, vi, beforeEach } from "vitest";
import mockedPrisma from "../libs/__mocks__/prisma";
import type { user_detail } from "@prisma/client";
import UserDetailController from "../src/controllers/user-detail.controller";
import { mockedReply, mockRequest } from "../utils/mock-fastify";
import { UserDetailInsert, UserDetailUpdate } from "../src/interfaces/IUserDetail";

describe("🧑‍💼 UserDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve all user details", async () => {
    const testDetails: user_detail[] = [
      {
        id: "detail-1",
        user_id: "user-1",
        image: "img.png",
        created_at: new Date("2025-01-01"),
        updated_at: new Date("2025-01-01"),
        color_ids: [],
        style_ids: [],
        payment_method: null,
        beer_level: 1,
      },
    ];
    mockedPrisma.user_detail.findMany.mockResolvedValue(testDetails);
    const request = mockRequest();
    await UserDetailController.getUserDetails(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testDetails);
  });

  it("should throw an error with wrong id : invalid uuid", async () => {
    const id = "detail-1";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await UserDetailController.getUserDetail(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(400);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Invalid uuid" });
  });

  it("should retrieve a specific user detail", async () => {
    const testDetail: user_detail = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      user_id: "user-1",
      image: "img.png",
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      color_ids: [],
      style_ids: [],
      payment_method: null,
      beer_level: 1,
    };
    mockedPrisma.user_detail.findUnique.mockResolvedValueOnce(testDetail);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await UserDetailController.getUserDetail(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testDetail);
  });

  it("should return 404 and clientMessage when user detail not found", async () => {
    const id = "123e4567-e89b-12d3-a456-426614174000";
    mockedPrisma.user_detail.findUnique.mockResolvedValue(null);

    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await UserDetailController.getUserDetail(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "UserDetail not found" });
  });

  it("should throw an error with wrong userId : invalid uuid", async () => {
    const userId = "user-1";
    const request = mockRequest<{ Params: { userId: string } }>({ params: { userId } });

    await UserDetailController.getDetailFromUser(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(400);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Invalid uuid" });
  });

  it("should retrieve details from user", async () => {
    const testDetails: user_detail[] = [
      {
        id: "detail-1",
        user_id: "123e4567-e89b-12d3-a456-426614174000",
        image: "img.png",
        created_at: new Date("2025-01-01"),
        updated_at: new Date("2025-01-01"),
        color_ids: [],
        style_ids: [],
        payment_method: null,
        beer_level: 1,
      },
    ];
    mockedPrisma.user_detail.findMany.mockResolvedValueOnce(testDetails);

    const userId = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { userId: string } }>({ params: { userId } });

    await UserDetailController.getDetailFromUser(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testDetails);
  });

  it("should return 404 and clientMessage when user details from user not found", async () => {
    const userId = "123e4567-e89b-12d3-a456-426614174000";
    mockedPrisma.user_detail.findMany.mockResolvedValueOnce([]); // Prisma returns [] if not found

    const request = mockRequest<{ Params: { userId: string } }>({ params: { userId } });

    await UserDetailController.getDetailFromUser(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "UserDetail not found" });
  });

  it("should create a user detail", async () => {
    const detailInsert: UserDetailInsert = {
      user: { connect: { id: "user-1" } },
      image: "img.png",
      color_ids: [],
      style_ids: [],
      beer_level: 1,
    };

    const insertResponse: user_detail = {
      id: "detail-1",
      user_id: "user-1",
      image: "img.png",
      color_ids: [],
      style_ids: [],
      beer_level: 1,
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      payment_method: null,
    };

    mockedPrisma.user_detail.create.mockResolvedValue(insertResponse);
    const request = mockRequest<{ Body: UserDetailInsert }>({
      body: detailInsert,
    });

    await UserDetailController.createUserDetail(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(insertResponse);
  });

  it("should update an existing user detail", async () => {
    const testDetail: user_detail = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      user_id: "user-1",
      image: "img.png",
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      color_ids: [],
      style_ids: [],
      payment_method: null,
      beer_level: 1,
    };

    mockedPrisma.user_detail.findUnique.mockResolvedValue(testDetail);
    mockedPrisma.user_detail.update.mockResolvedValue({ ...testDetail, image: "img2.png" });

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const payload: UserDetailUpdate = {
      image: "img2.png",
    };

    const request = mockRequest<{ Params: { id: string }; Body: UserDetailUpdate }>({
      params: { id },
      body: payload,
    });

    await UserDetailController.updateUserDetail(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith({ ...testDetail, image: "img2.png" });
  });

  it("should throw an error when updating a non-existing user detail", async () => {
    mockedPrisma.user_detail.findUnique.mockResolvedValue(null);
    const id = "123e4567-e89b-12d3-a456-426614174000";
    const payload: UserDetailUpdate = {
      image: "img2.png",
    };

    const request = mockRequest<{ Params: { id: string }; Body: UserDetailUpdate }>({
      params: { id },
      body: payload,
    });

    await UserDetailController.updateUserDetail(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "UserDetail not found" });
  });

  it("should delete a user detail", async () => {
    const testDetail: user_detail = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      user_id: "user-1",
      image: "img.png",
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      color_ids: [],
      style_ids: [],
      payment_method: null,
      beer_level: 1,
    };

    mockedPrisma.user_detail.findUnique.mockResolvedValue(testDetail);
    mockedPrisma.user_detail.delete.mockResolvedValue(testDetail);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await UserDetailController.deleteUserDetail(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testDetail);
  });

  it("shouldn't delete a non-existing user detail", async () => {
    mockedPrisma.user_detail.findUnique.mockResolvedValue(null);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await UserDetailController.deleteUserDetail(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "UserDetail not found" });
  });
});
