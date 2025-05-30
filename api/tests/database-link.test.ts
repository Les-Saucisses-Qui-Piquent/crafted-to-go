import { describe, it, expect } from "vitest";

describe("Database link", () => {
  it("should be up", async () => {
    const response = await fetch("http://localhost:3000/test");
    expect(response.status).toBe(200);
  });

  it("should retrieve default test data", async () => {
    const response = await fetch("http://localhost:3000/test");
    const data = await response.json();

    expect(data[0].id).toBe(1);
    expect(data[0].first_name).toBe("John");
    expect(data[0].last_name).toBe("Doe");
  });
});
