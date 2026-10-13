import { describe, it, expect } from "vitest";
import FoodSchema from "./foodSchema"; // model (runtime validation)
import FoodItemModel from "./foodSchema";
import WishlistSchema from "./wishlistSchema"; // model (runtime validation)
import WishlistItemModel from "./wishlistSchema";
import { FoodItem } from "@/types/foodItem";
import { WishlistItem } from "@/types/wishlistItem";

const futureDate = new Date(Date.now() + 86_400_000);

// Typed fixtures: the compiler keeps these in sync with your type definitions.
const validFood: FoodItem = {
  id: "000000",
  name: "Milk",
  category: "Dairy",
  quantity: 1,
  expiration_date: futureDate,
};

const validWishlist: WishlistItem = {
  name: "Cheese",
  category: "Dairy",
  quantity: 1,
};

describe("quantity validation", () => {
  it.each([
    ["inventory: zero (boundary)", FoodItemModel, validFood, 0, true],
    ["inventory: one (boundary)", FoodItemModel, validFood, 1, true],
    ["inventory: negative", FoodItemModel, validFood, -1, false],
    ["inventory: fraction", FoodItemModel, validFood, 1.5, false],
    ["wishlist: zero", WishlistItemModel, validWishlist, 0, false],
    ["wishlist: one (boundary)", WishlistItemModel, validWishlist, 1, true],
    ["wishlist: negative", WishlistItemModel, validWishlist, -1, false],
    ["wishlist: fraction", WishlistItemModel, validWishlist, 2.5, false],
  ])("%s", (_label, Model: any, base, quantity, shouldBeValid) => {
    const err = new Model({ ...base, quantity }).validateSync();

    if (shouldBeValid) {
      expect(err).toBeUndefined();
    } else {
      expect(err?.errors.quantity).toBeDefined();
    }
  });
});

describe("required fields", () => {
  // Invalid data intentionally violates the type, so it is cast.
  it.each([
    ["missing name", { ...validFood, name: undefined }, "name"],
    ["missing category", { ...validFood, category: undefined }, "category"],
    ["blank name", { ...validFood, name: "   " }, "name"],
  ])("food rejects %s", (_label, data, field) => {
    const err = new FoodItemModel(data as unknown as FoodItem).validateSync();
    expect(err?.errors[field]).toBeDefined();
  });

  it.each([
    ["missing name", { ...validWishlist, name: undefined }, "name"],
    ["missing category", { ...validWishlist, category: undefined }, "category"],
  ])("wishlist rejects %s", (_label, data, field) => {
    const err = new WishlistItemModel(data as unknown as WishlistItem).validateSync();
    expect(err?.errors[field]).toBeDefined();
  });
});

describe("expiration date validation", () => {
  it("food rejects an invalid expiration date", () => {
    const bad = { ...validFood, expiration_date: "not-a-date" } as unknown as FoodItem;
    const err = new FoodItemModel(bad).validateSync();
    expect(err?.errors.expiration_date).toBeDefined();
  });

  it("food accepts a valid future expiration date", () => {
    expect(new FoodItemModel(validFood).validateSync()).toBeUndefined();
  });
});
