import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import connectDB from "@/database/db";
import FoodItemModel from "@/database/foodSchema";

vi.mock("@/database/db", () => ({
  default: vi.fn(),
}));

vi.mock("@/database/foodSchema", () => ({
  default: {
    create: vi.fn(),
  },
}));

function makeRequest(body: string): Request {
  return new Request("http://localhost/api/inventory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

const validItem = {
  name: "Apples",
  expiration_date: "2026-11-01",
  category: "Fruit",
  quantity: 5,
};

describe("POST /api/inventory", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(connectDB).mockImplementation(async () => undefined as never);
  });

  it("saves a valid inventory item and returns 201", async () => {
    const savedItem = {
      id: "abc123",
      ...validItem,
    };

    vi.mocked(FoodItemModel.create).mockResolvedValue(savedItem as never);

    const response = await POST(makeRequest(JSON.stringify(validItem)));

    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject(savedItem);

    expect(connectDB).toHaveBeenCalledOnce();
    expect(FoodItemModel.create).toHaveBeenCalledOnce();

    expect(FoodItemModel.create).toHaveBeenCalledWith(expect.objectContaining(validItem));
  });

  it.each([
    ["missing name", { ...validItem, name: undefined }],
    ["blank name", { ...validItem, name: "   " }],
    ["missing category", { ...validItem, category: undefined }],
    ["blank category", { ...validItem, category: "   " }],
    [
      "missing expiration date",
      {
        ...validItem,
        expiration_date: undefined,
      },
    ],
    [
      "invalid expiration date",
      {
        ...validItem,
        expiration_date: "not-a-date",
      },
    ],
    ["missing quantity", { ...validItem, quantity: undefined }],
    ["zero quantity", { ...validItem, quantity: 0 }],
    ["negative quantity", { ...validItem, quantity: -2 }],
    ["fractional quantity", { ...validItem, quantity: 1.5 }],
  ])("rejects %s without saving", async (_label, item) => {
    const response = await POST(makeRequest(JSON.stringify(item)));

    expect(response.status).toBe(400);
    expect(FoodItemModel.create).not.toHaveBeenCalled();
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
    expect(FoodItemModel.create).not.toHaveBeenCalled();
    expect(connectDB).not.toHaveBeenCalled();
  });
});
