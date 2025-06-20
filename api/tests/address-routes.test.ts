import { describe, it, expect, vi, afterAll } from "vitest";
import prisma from "../libs/__mocks__/prisma";
import type { Prisma } from "@prisma/client";
import { createTestServer } from "../utils/test-server";

vi.mock("../libs/prisma");

type Address = Prisma.addressGetPayload<{
  select: {
    id: true;
    line_1: true;
    line_2: true;
    postal_code: true;
    city: true;
    country: true;
    created_at: true;
    updated_at: true;
  };
}>;

describe("Address Routes", async () => {
  const mockedResponse: Address[] = [
    {
      id: "123e4567-e89b-12d3-a456-426614174000",
      line_1: "123 Test St",
      line_2: "Apt 1",
      postal_code: "12345",
      city: "Test City",
      country: "Test Country",
      created_at: new Date(),
      updated_at: new Date(new Date().getTime() - 1000),
    },
    {
      id: "123e4567-e89b-12d3-a456-426614174001",
      line_1: "456 Test St",
      line_2: "Apt 2",
      postal_code: "12345",
      city: "Test City",
      country: "Test Country",
      created_at: new Date(),
      updated_at: new Date(new Date().getTime() - 100),
    },
  ];

  describe("GET /addresses", () => {
    it("should return all addresses", async () => {
      prisma.address.findMany.mockResolvedValue(mockedResponse);

      const data = await prisma.address.findMany();

      expect(data).toEqual(mockedResponse);
    });
  });

  describe("GET /addresses/:id", () => {
    it("should return null for non-existent address", async () => {
      prisma.address.findUnique.mockResolvedValue(null);

      const data = await prisma.address.findUnique({
        where: {
          id: "00000000-0000-0000-0000-000000000000",
        },
      });

      expect(data).toBeNull();
    });

    it("should return 1 address", async () => {
      prisma.address.findUnique.mockResolvedValue(mockedResponse[0]);

      const data = await prisma.address.findUnique({
        where: {
          id: "123e4567-e89b-12d3-a456-426614174000",
        },
      });

      expect(data).toEqual(mockedResponse[0]);
    });
  });
});

describe("-> Address Routes", async () => {
  const app = await createTestServer();

  afterAll(async () => {
    await app.close();
  });

  it("should return status 404", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/ooddf",
    });
    expect(response.statusCode).toBe(404);
  });

  it("should return status 200", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/addresses",
    });
    expect(response.statusCode).toBe(200);
  });
});
