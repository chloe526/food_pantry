import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const connect = vi.fn();
vi.mock("mongoose", () => ({ default: { connect } }));

async function load() {
  vi.resetModules();
  delete (globalThis as any)._mongooseCache;
  return (await import("./db")).default; // adjust path
}

describe("connectDB", () => {
  beforeEach(() => {
    connect.mockReset();
    vi.stubEnv("MONGO_URI", "mongodb://test");
  });
  afterEach(() => vi.unstubAllEnvs());

  it("concurrent calls reuse one connection attempt", async () => {
    const conn = { id: "conn" };
    connect.mockResolvedValue(conn);
    const connectDB = await load();

    const results = await Promise.all([connectDB(), connectDB(), connectDB()]);

    expect(connect).toHaveBeenCalledTimes(1);
    results.forEach((r) => expect(r).toBe(conn));
  });

  it("a failed connection can be retried successfully", async () => {
    const conn = { id: "conn" };
    connect.mockRejectedValueOnce(new Error("Couldn't Connect")).mockResolvedValueOnce(conn);
    const connectDB = await load();

    await expect(connectDB()).rejects.toThrow("Couldn't Connect");
    await expect(connectDB()).resolves.toBe(conn);
    expect(connect).toHaveBeenCalledTimes(2);
  });
});
