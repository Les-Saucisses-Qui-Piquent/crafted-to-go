import { describe, it, expect } from "vitest";

describe("API root & health", () => {
  it("should be up", async () => {
    const response = await fetch("http://127.0.0.1:3000/");
    expect(response.status).toBe(200);
    expect(await response.json()).toStrictEqual({ status: "ok" });
  });
});
