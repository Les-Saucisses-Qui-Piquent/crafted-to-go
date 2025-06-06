import { describe, it, expect, afterAll, vi } from "vitest";
import { createTestServer } from "../utils/test-server";
import prisma from "../libs/__mocks__/prisma";

vi.mock("../libs/prisma");

describe.skip("DOES NOT WORK - Address Routes", async () => {
  // Create a test server context BEFORE all the tests runs...
  const api = await createTestServer();

  // // .. and close it AFTER all the tests runs
  afterAll(async () => {
    await api.close();
  });

  describe("GET /addresses", () => {
    it("should return empty array when no addresses exist", async () => {
      prisma.address.findMany.mockResolvedValue([]);

      const response = await api.inject({
        method: "GET",
        url: "/addresses",
      });

      expect(response.statusCode).toBe(200);
      const addresses = JSON.parse(response.payload);
      expect(addresses).toEqual([]);
    });

    it("should return all addresses", async () => {
      const mockAddresses = [
        {
          id: "123e4567-e89b-12d3-a456-426614174000",
          street: "123 Test St",
          city: "Test City",
          postal_code: "12345",
          country: "Test Country",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      // prisma.address.findMany.mockResolvedValue(mockAddresses);

      const response = await api.inject({
        method: "GET",
        url: "/addresses",
      });

      expect(response.statusCode).toBe(200);
      const addresses = JSON.parse(response.payload);
      expect(addresses).toHaveLength(1);
      expect(addresses[0]).toMatchObject({
        street: mockAddresses[0].street,
        city: mockAddresses[0].city,
      });
    });
  });

  describe("GET /addresses/:id", () => {
    it("should return 404 for non-existent address", async () => {
      prisma.address.findUnique.mockResolvedValue(null);

      const response = await api.inject({
        method: "GET",
        url: "/addresses/00000000-0000-0000-0000-000000000000",
      });

      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.payload)).toEqual({
        message: "Address not found",
      });
    });
  });
});
