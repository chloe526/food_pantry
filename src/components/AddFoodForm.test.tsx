// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import AddFoodForm from "./AddFoodForm";

// next/link expects the Next.js router; a plain <a> is enough for these tests.
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

// Sets a field's value the way React sees a user edit: fires a change event.
function setField(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

// Clicks the submit button, which submits the form.
function clickSubmit() {
  fireEvent.click(screen.getByRole("button", { name: "Add food" }));
}

// Fills every field with valid values.
function fillValidForm(name = "Milk") {
  setField("Food name", name);
  setField("Category", "Dairy");
  setField("Quantity", "3");
  setField("Expiration date", "2026-10-20");
}

// Checks every field still holds what fillValidForm entered.
function expectFormStillFilled(name = "Milk") {
  expect((screen.getByLabelText("Food name") as HTMLInputElement).value).toBe(name);
  expect((screen.getByLabelText("Category") as HTMLSelectElement).value).toBe("Dairy");
  expect((screen.getByLabelText("Quantity") as HTMLInputElement).value).toBe("3");
  expect((screen.getByLabelText("Expiration date") as HTMLInputElement).value).toBe("2026-10-20");
}

describe("AddFoodForm", () => {
  // Test 1: Invalid input prevents POST and displays validation feedback.
  // Submits an empty form, then checks that all four error messages appear,
  // the name field is marked invalid and receives focus, and fetch is never called.
  it("shows validation errors, focuses the first invalid field, and does not call the API", () => {
    render(<AddFoodForm />);

    clickSubmit();

    expect(screen.getByText("Enter a food name.")).toBeTruthy();
    expect(screen.getByText("Choose a category.")).toBeTruthy();
    expect(screen.getByText("Enter a whole number, 0 or more.")).toBeTruthy();
    expect(screen.getByText("Enter a valid expiration date.")).toBeTruthy();

    const nameInput = screen.getByLabelText("Food name");
    expect(nameInput.getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(nameInput);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  // Test 2: Valid input sends the expected JSON and displays success.
  // The fake server answers OK. Checks the POST goes to /api/items with a
  // trimmed name and a numeric quantity, the "Added Milk." message shows,
  // and the form is cleared for the next entry.
  it("posts a trimmed, typed payload, shows a success message, and clears the form", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
    render(<AddFoodForm />);

    fillValidForm("  Milk  ");
    clickSubmit();

    expect(await screen.findByText(/Added Milk\./)).toBeTruthy();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/items");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({
      name: "Milk",
      category: "Dairy",
      quantity: 3, // a number, not "3"
      expiration_date: "2026-10-20",
    });

    expect((screen.getByLabelText("Food name") as HTMLInputElement).value).toBe("");
    expect((screen.getByLabelText("Quantity") as HTMLInputElement).value).toBe("");
  });

  // Test 3: Failed POST displays an error and preserves form values.
  // The fake server answers with an HTTP error and { errors: [...] }.
  // Checks the messages appear in the alert, no success message shows,
  // every field keeps its value, and the button is usable again.
  it("shows the server's error messages and keeps the user's input", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ errors: ["Name is too long.", "Quantity is too large."] }),
    });
    render(<AddFoodForm />);

    fillValidForm();
    clickSubmit();

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toBe("Name is too long. Quantity is too large.");

    // An HTTP error must not trigger success or clear the form.
    expect(screen.queryByText(/Added/)).toBeNull();
    expectFormStillFilled();
    expect((screen.getByRole("button", { name: "Add food" }) as HTMLButtonElement).disabled).toBe(false);
  });

  // Test 4: Negative and fractional quantities are rejected.
  // Fills a valid form, then tries -1 and 2.5 as the quantity. Each attempt
  // must show the quantity error and focus that field, and fetch is never called.
  it("rejects negative and fractional quantities without calling the API", () => {
    render(<AddFoodForm />);
    fillValidForm();

    const quantity = screen.getByLabelText("Quantity");

    for (const bad of ["-1", "2.5"]) {
      setField("Quantity", bad);
      clickSubmit();

      expect(screen.getByText("Enter a whole number, 0 or more.")).toBeTruthy();
      expect(quantity.getAttribute("aria-invalid")).toBe("true");
      expect(document.activeElement).toBe(quantity);
    }

    expect(fetchMock).not.toHaveBeenCalled();
  });

  // Test 5: Network failures are handled.
  // fetch itself throws, as it does when the user is offline or the server is down.
  // Checks the "Couldn't reach the server" message shows, no success message
  // appears, and every field keeps its value.
  it("shows a connection message when the request fails, and keeps the user's input", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    render(<AddFoodForm />);

    fillValidForm();
    clickSubmit();

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toBe("Couldn't reach the server. Check your connection and try again.");

    expect(screen.queryByText(/Added/)).toBeNull();
    expectFormStillFilled();
    expect((screen.getByRole("button", { name: "Add food" }) as HTMLButtonElement).disabled).toBe(false);
  });
});
