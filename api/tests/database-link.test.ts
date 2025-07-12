import { describe, it, expect } from "vitest";
import prisma from "../libs/__mocks__/prisma";

describe("Integration tests", () => {
  it("should retrieve default test data", async () => {
    const newTest = {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      created_at: new Date(),
      updated_at: new Date(),
    };

    prisma.test.findMany.mockResolvedValue([newTest]);

    const data = await prisma.test.findMany();

    expect(data).toStrictEqual([newTest]);
  });
});
