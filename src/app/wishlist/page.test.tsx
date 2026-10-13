import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import WishlistPage from "./page";

const fetchMock = vi.fn();

function jsonResponse(data: unknown, ok = true) {
  return {
    ok,
    json: async () => data,
  } as unknown as Response;
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("WishlistPage", () => {
  it("shows a load error instead of the empty state and recovers with Retry", async () => {
    fetchMock.mockRejectedValueOnce(new Error("Network error")).mockResolvedValueOnce(
      jsonResponse([
        {
          _id: "item-1",
          name: "Rice",
          category: "Pantry Staples",
          quantity: 2,
        },
      ]),
    );

    const user = userEvent.setup();
    render(<WishlistPage />);

    expect(await screen.findByText("Network error")).toBeInTheDocument();
    expect(screen.queryByText("No wishlist requests yet.")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Retry" }));

    expect(await screen.findByText("Rice")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("keeps entered values when saving a request fails", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse([]))
      .mockResolvedValueOnce(jsonResponse({ error: "Could not save request." }, false));

    const user = userEvent.setup();
    render(<WishlistPage />);

    await screen.findByText("No wishlist requests yet.");

    await user.type(screen.getByLabelText(/food name/i), "Oats");
    await user.selectOptions(screen.getByLabelText(/category/i), "Produce");
    await user.type(screen.getByLabelText(/requested quantity/i), "2");
    await user.click(screen.getByRole("button", { name: "Add request" }));

    expect(await screen.findByText("Could not save request.")).toBeInTheDocument();
    expect(screen.getByLabelText(/food name/i)).toHaveValue("Oats");
    expect(screen.getByLabelText(/category/i)).toHaveValue("Produce");
    expect(screen.getByLabelText(/requested quantity/i)).toHaveValue(2);
  });

  it("shows the saved request and clears the form after a successful save", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([])).mockResolvedValueOnce(
      jsonResponse({
        _id: "item-2",
        name: "Lentils",
        category: "Pantry Staples",
        quantity: 3,
      }),
    );

    const user = userEvent.setup();
    render(<WishlistPage />);

    await screen.findByText("No wishlist requests yet.");

    await user.type(screen.getByLabelText(/food name/i), "Lentils");
    await user.selectOptions(screen.getByLabelText(/category/i), "Pantry Staples");
    await user.type(screen.getByLabelText(/requested quantity/i), "3");
    await user.click(screen.getByRole("button", { name: "Add request" }));

    expect(await screen.findByText("Your wishlist request was added.")).toBeInTheDocument();
    expect(screen.getByText("Lentils")).toBeInTheDocument();

    expect(screen.getByLabelText(/food name/i)).toHaveValue("");
    expect(screen.getByLabelText(/category/i)).toHaveValue("");
    expect((screen.getByLabelText(/requested quantity/i) as HTMLInputElement).value).toBe("");
  });
});
