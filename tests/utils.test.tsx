import { afterEach, describe, test, expect } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import FoodCard from "../src/components/FoodCard";
import Navbar from "../src/components/Navbar";
import Quickinfo from "../src/components/QuickInfo";
import { FoodItem } from "@/types/foodItem";

afterEach(() => {
  cleanup();
});

const mockItem: FoodItem = {
  id: "abc123",
  name: "Apples",
  category: "Fruit",
  quantity: 5,
  expiration_date: new Date(31, 12, 2026),
};

describe("FoodCard", () => {
  test("renders the food name and category", () => {
    render(<FoodCard item={mockItem} />);

    expect(screen.getByText("Apples")).toBeTruthy();
    expect(screen.getByText("Category: Fruit")).toBeTruthy();
  });

  test("displays the quantity when food is in stock", () => {
    render(<FoodCard item={mockItem} />);

    expect(screen.getByText("Quantity: 5")).toBeTruthy();
  });

  test("displays out of stock when quantity is zero", () => {
    render(<FoodCard item={{ ...mockItem, quantity: 0 }} />);

    expect(screen.getByText("Out of stock")).toBeTruthy();
    expect(screen.queryByText("Quantity: 0")).toBeNull();
  });

  test("displays the expiration date", () => {
    render(<FoodCard item={mockItem} />);

    const expectedDate = new Date(mockItem.expiration_date).toLocaleDateString();

    expect(screen.getByText(`Best by: ${expectedDate}`)).toBeTruthy();
  });
});

describe("Navbar", () => {
  test("renders the navigation bar", () => {
    render(<Navbar />);

    expect(screen.getByRole("navigation")).toBeTruthy();
  });

  test("displays the PolyPantry brand link", () => {
    render(<Navbar />);

    const brandLink = screen.getByRole("link", {
      name: /polypantry/i,
    });

    expect(brandLink).toBeTruthy();
    expect(brandLink.getAttribute("href")).toBe("/");
  });

  test("contains a link to the About page", () => {
    render(<Navbar />);

    expect(screen.getByRole("link", { name: /about/i }).getAttribute("href")).toBe("/about");
  });

  test("contains a link to the Menu page", () => {
    render(<Navbar />);

    expect(screen.getByRole("link", { name: /menu/i }).getAttribute("href")).toBe("/menu");
  });

  test("contains a link to the Wishlist page", () => {
    render(<Navbar />);

    expect(screen.getByRole("link", { name: /wishlist/i }).getAttribute("href")).toBe("/wishlist");
  });

  test("contains a link to the Contact page", () => {
    render(<Navbar />);

    expect(screen.getByRole("link", { name: /contact/i }).getAttribute("href")).toBe("/contact");
  });

  test("renders all five expected links", () => {
    render(<Navbar />);

    const links = screen.getAllByRole("link");

    expect(links.length).toBe(5);
  });
});

describe("Quickinfo", () => {
  test("renders without crashing", () => {
    const { container } = render(<Quickinfo primary="Free groceries" secondary="Available to Cal Poly students" />);

    expect(container.firstChild).toBeTruthy();
  });
});
