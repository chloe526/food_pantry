import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import connectDB from "@/database/db";
import WishlistItemModel from "@/database/wishlistSchema";

vi.mock("@/database/db", () => ({
  default: vi.fn(),
}));

vi.mock("@/database/wishlistSchema", () => ({
  default: {
    create: vi.fn(),
  },
}));

function makeRequest(body: string): Request {
  return new Request("http://localhost/api/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

const validItem = {
  name: "Bananas",
  category: "Fruit",
  quantity: 3,
};

describe("POST /api/wishlist", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(connectDB).mockImplementation(async () => undefined as never);
  });

  it("saves a valid wishlist item and returns 201", async () => {
    const savedItem = {
      _id: "test-id",
      ...validItem,
    };

    vi.mocked(WishlistItemModel.create).mockResolvedValue(savedItem as never);

    const response = await POST(makeRequest(JSON.stringify(validItem)));

    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject(savedItem);

    expect(connectDB).toHaveBeenCalledOnce();
    expect(WishlistItemModel.create).toHaveBeenCalledOnce();

    expect(WishlistItemModel.create).toHaveBeenCalledWith(validItem);
  });

  it.each([
    ["missing name", { ...validItem, name: undefined }],
    ["blank name", { ...validItem, name: "   " }],
    ["missing category", { ...validItem, category: undefined }],
    ["blank category", { ...validItem, category: "   " }],
    ["missing quantity", { ...validItem, quantity: undefined }],
    ["zero quantity", { ...validItem, quantity: 0 }],
    ["negative quantity", { ...validItem, quantity: -1 }],
    ["fractional quantity", { ...validItem, quantity: 1.5 }],
  ])("rejects %s without saving", async (_label, item) => {
    const response = await POST(makeRequest(JSON.stringify(item)));

    expect(response.status).toBe(400);
    expect(WishlistItemModel.create).not.toHaveBeenCalled();
    expect(connectDB).not.toHaveBeenCalled();
  });

  it.each([
    ["malformed JSON", "{"],
    ["null body", "null"],
    ["array body", "[]"],
    ["string body", '"hello"'],
  ])("rejects %s without saving", async (_label, body) => {
    const response = await POST(makeRequest(body));

    expect(response.status).toBe(400);
    expect(WishlistItemModel.create).not.toHaveBeenCalled();
    expect(connectDB).not.toHaveBeenCalled();
  });
});
