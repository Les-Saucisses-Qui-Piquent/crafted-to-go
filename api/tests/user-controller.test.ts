import { describe, it, expect, vi, beforeEach } from "vitest";
import mockedPrisma from "../libs/__mocks__/prisma";
import type { user } from "@prisma/client";
import { UserRole } from "@prisma/client";
import UserController from "../src/controllers/user.controller";
import { mockedReply, mockRequest } from "../utils/mock-fastify";
import { UserInsert, UserUpdate } from "../src/interfaces/IUser";

describe("👤 User", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve all users", async () => {
    const testUsers: user[] = [
      {
        id: "user-1",
        first_name: "John",
        last_name: "Doe",
        birth_date: new Date("2000-01-01"),
        email: "john@example.com",
        phone_number: "1234567890",
        password: "hashed",
        created_at: new Date("2025-01-01"),
        updated_at: new Date("2025-01-01"),
        role: UserRole.client,
        address_id: null,
      },
    ];
    mockedPrisma.user.findMany.mockResolvedValue(testUsers);
    const request = mockRequest();

    await UserController.getUsers(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testUsers);
  });

  it("should throw an error with wrong id : invalid uuid", async () => {
    const id = "user-1";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await UserController.getUser(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(400);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "Invalid uuid" });
  });

  it("should retrieve a specific user", async () => {
    const testUser: user = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      first_name: "John",
      last_name: "Doe",
      birth_date: new Date("2000-01-01"),
      email: "john@example.com",
      phone_number: "1234567890",
      password: "hashed",
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      role: UserRole.client,
      address_id: null,
    };
    mockedPrisma.user.findUnique.mockResolvedValueOnce(testUser);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await UserController.getUser(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testUser);
  });

  it("should return 404 and clientMessage when user not found", async () => {
    const id = "123e4567-e89b-12d3-a456-426614174000";
    mockedPrisma.user.findUnique.mockResolvedValue(null);

    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });
    await UserController.getUser(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "User not found" });
  });

  it("should create a user", async () => {
    const userInsert: UserInsert = {
      first_name: "John",
      last_name: "Doe",
      birth_date: new Date("2000-01-01"),
      email: "john@example.com",
      phone_number: "1234567890",
      password: "hashed",
      role: UserRole.client,
    };

    const insertResponse = {
      id: "user-1",
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      address_id: null,
      birth_date: new Date("2000-01-01"),
      role: UserRole.client,
    };

    mockedPrisma.user.create.mockResolvedValue({
      ...userInsert,
      ...insertResponse,
    });

    const request = mockRequest<{ Body: UserInsert }>({
      body: {
        ...userInsert,
      },
    });

    await UserController.createUser(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith({
      ...userInsert,
      ...insertResponse,
    });
  });

  it("should update an existing user", async () => {
    const testUser: user = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      first_name: "John",
      last_name: "Doe",
      birth_date: new Date("2000-01-01"),
      email: "john@example.com",
      phone_number: "1234567890",
      password: "hashed",
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      role: UserRole.client,
      address_id: null,
    };

    mockedPrisma.user.findUnique.mockResolvedValue(testUser);
    mockedPrisma.user.update.mockResolvedValue({ ...testUser, first_name: "Jane" });

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const payload: UserUpdate = {
      first_name: "Jane",
    };

    const request = mockRequest<{ Params: { id: string }; Body: UserUpdate }>({
      params: { id },
      body: payload,
    });

    await UserController.updateUser(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith({ ...testUser, first_name: "Jane" });
  });

  it("should throw an error when updating a non-existing user", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(null);
    const id = "123e4567-e89b-12d3-a456-426614174000";
    const payload: UserUpdate = {
      first_name: "Jane",
    };

    const request = mockRequest<{ Params: { id: string }; Body: UserUpdate }>({
      params: { id },
      body: payload,
    });

    await UserController.updateUser(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "User not found" });
  });

  it("should delete a user", async () => {
    const testUser: user = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      first_name: "John",
      last_name: "Doe",
      birth_date: new Date("2000-01-01"),
      email: "john@example.com",
      phone_number: "1234567890",
      password: "hashed",
      created_at: new Date("2025-01-01"),
      updated_at: new Date("2025-01-01"),
      role: UserRole.client,
      address_id: null,
    };

    mockedPrisma.user.findUnique.mockResolvedValue(testUser);
    mockedPrisma.user.delete.mockResolvedValue(testUser);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await UserController.deleteUser(request, mockedReply);

    expect(mockedReply.send).toHaveBeenCalledWith(testUser);
  });

  it("shouldn't delete a non-existing user", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(null);

    const id = "123e4567-e89b-12d3-a456-426614174000";
    const request = mockRequest<{ Params: { id: string } }>({ params: { id } });

    await UserController.deleteUser(request, mockedReply);

    expect(mockedReply.status).toHaveBeenCalledWith(404);
    expect(mockedReply.send).toHaveBeenCalledWith({ clientMessage: "User not found" });
  });
});
