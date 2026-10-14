import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import MenuPage from "@/app/menu/page";

const item = {
  id: "1",
  name: "Apples",
  category: "Produce",
  quantity: 4,
  expiration_date: "2026-11-01T00:00:00.000Z",
};

function mockInventory(response: unknown, ok = true) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok, json: async () => response }));
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("MenuPage", () => {
  test("shows a loading message while inventory is requested", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    );

    render(<MenuPage />);

    expect(screen.getByRole("status").textContent).toContain("Loading pantry inventory");
  });

  test("shows fetched inventory", async () => {
    mockInventory([item]);
    render(<MenuPage />);

    expect(await screen.findByRole("heading", { name: item.name })).toBeTruthy();
    expect(screen.getByText("1 item found")).toBeTruthy();
  });

  test("shows the empty state when the pantry has no items", async () => {
    mockInventory([]);
    render(<MenuPage />);

    expect(await screen.findByText("The food pantry is currently out of stock.")).toBeTruthy();
  });

  test("shows an error and retries the request", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [item],
      });
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    render(<MenuPage />);

    expect(await screen.findByRole("alert")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByRole("heading", { name: item.name })).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
