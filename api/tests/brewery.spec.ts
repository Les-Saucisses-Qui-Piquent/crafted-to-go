import { describe, it, expect } from "vitest";
import mockedPrisma from "../libs/__mocks__/prisma";
import BreweryRepository from "../src/repository/brewery.repository";

describe("Brewery", () => {
  const breweryRepository = new BreweryRepository(mockedPrisma);

  it("should retrieve breweries", async () => {
    const testBreweries = [
      {
        id: "1",
        name: "Test Brewery",
        created_at: new Date("2025-01-01"),
        updated_at: new Date("2025-01-01"),
        address_id: "1",
        RIB: "1234567890",
        siren: "1234567890",
        owner_id: "1",
      },
    ];

    mockedPrisma.brewery.findMany.mockResolvedValue(testBreweries);

    const breweries = await breweryRepository.getBreweries();
    expect(breweries).toStrictEqual([
      {
        id: "1",
        name: "Test Brewery",
        created_at: new Date("2025-01-01"),
        updated_at: new Date("2025-01-01"),
        address_id: "1",
        RIB: "1234567890",
        siren: "1234567890",
        owner_id: "1",
      },
    ]);
  });
});
