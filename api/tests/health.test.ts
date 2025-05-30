import { describe, it, expect } from "vitest";

describe("API root & health", () => {
  it("should be up", async () => {
    const response = await fetch("http://localhost:3000/health");
    expect(response.status).toBe(200);
    expect(await response.json()).toStrictEqual({ status: "ok" });
  });
});
