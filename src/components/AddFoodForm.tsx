"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Form.module.css";

const CATEGORIES = ["Produce", "Dairy", "Protein", "Grain", "Canned", "Beverages", "Other"];

interface FoodFormValues {
  name: string;
  category: string;
  quantity: string;
  expiration_date: string;
}

type FormErrors = Partial<Record<keyof FoodFormValues, string>>;
type Status = "idle" | "saving" | "success" | "error";

const initialValues: FoodFormValues = {
  name: "",
  category: "",
  quantity: "",
  expiration_date: "",
};

function isRealDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

function validate(values: FoodFormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Enter a food name.";
  }

  if (!values.category) {
    errors.category = "Choose a category.";
  }

  const qty = Number(values.quantity);
  if (values.quantity.trim() === "" || !Number.isInteger(qty) || qty < 0) {
    errors.quantity = "Enter a whole number, 0 or more.";
  }

  if (!isRealDate(values.expiration_date)) {
    errors.expiration_date = "Enter a valid expiration date.";
  }

  return errors;
}

export default function AddFoodForm() {
  const [values, setValues] = useState<FoodFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [lastSavedName, setLastSavedName] = useState("");

  const isSaving = status === "saving";

  // One change handler for every field. The input's `name` attribute
  // tells us which key in `values` to update.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const field = name as keyof FoodFormValues;

    setValues((prev) => ({ ...prev, [field]: value }));

    // Clear this field's error as soon as the user starts fixing it.
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Hide the old success/error banner once they start a new entry.
    if (status === "success" || status === "error") {
      setStatus("idle");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Stop the browser from reloading the page.
    e.preventDefault();

    // 1. Validate before touching the API.
    const found = validate(values);
    setErrors(found);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      // Move focus to the first problem so keyboard and screen-reader
      // users land right where they need to fix something.
      const el = e.currentTarget.elements.namedItem(firstInvalid);
      if (el instanceof HTMLElement) el.focus();
      return;
    }

    // 2. Save. This disables the button and shows "Saving…".
    setStatus("saving");
    setServerMessage("");

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          category: values.category,
          quantity: Number(values.quantity), // route requires a number
          expiration_date: values.expiration_date, // "YYYY-MM-DD"
        }),
      });

      if (!res.ok) {
        // The route returns { errors: string[] } for invalid data
        // or { error: string } for a bad payload. Handle both.
        const data = await res.json().catch(() => ({}));
        const message =
          (Array.isArray(data.errors) && data.errors.join(" ")) ||
          data.error ||
          "The item couldn't be saved. Please try again.";
        setServerMessage(message);
        setStatus("error"); // keep their input so they can fix and resubmit
        return;
      }

      // 3. Success: remember the name for the message, then clear the form.
      setLastSavedName(values.name.trim());
      setValues(initialValues);
      setStatus("success");
    } catch {
      // fetch itself failed: server down, offline, etc.
      setServerMessage("Couldn't reach the server. Check your connection and try again.");
      setStatus("error");
    }
  };

  // Helper so each input gets matching aria attributes.
  // aria-describedby points screen readers at the error text.
  const describedBy = (field: keyof FoodFormValues) => (errors[field] ? `${field}-error` : undefined);

  return (
    // noValidate: we show our own messages instead of the browser's popups.
    <form className={styles.form} onSubmit={handleSubmit} noValidate aria-busy={isSaving}>
      {/* Name */}
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          FOOD NAME
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="off"
          className={styles.input}
          value={values.name}
          onChange={handleChange}
          aria-invalid={!!errors.name}
          aria-describedby={describedBy("name")}
        />
        {errors.name && (
          <p id="name-error" className={styles.error}>
            {errors.name}
          </p>
        )}
      </div>

      {/* Category */}
      <div className={styles.field}>
        <label htmlFor="category" className={styles.label}>
          CATEGORY
        </label>
        <select
          id="category"
          name="category"
          className={styles.input}
          value={values.category}
          onChange={handleChange}
          aria-invalid={!!errors.category}
          aria-describedby={describedBy("category")}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.category && (
          <p id="category-error" className={styles.error}>
            {errors.category}
          </p>
        )}
      </div>

      {/* Quantity and date sit side by side on wider screens */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="quantity" className={styles.label}>
            QUANTITY
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            inputMode="numeric" // number keypad on phones
            min={0}
            step={1}
            className={styles.input}
            value={values.quantity}
            onChange={handleChange}
            aria-invalid={!!errors.quantity}
            aria-describedby={describedBy("quantity")}
          />
          {errors.quantity && (
            <p id="quantity-error" className={styles.error}>
              {errors.quantity}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="expiration_date" className={styles.label}>
            EXPIRATION DATE
          </label>
          <input
            id="expiration_date"
            name="expiration_date"
            type="date"
            className={styles.input}
            value={values.expiration_date}
            onChange={handleChange}
            aria-invalid={!!errors.expiration_date}
            aria-describedby={describedBy("expiration_date")}
          />
          {errors.expiration_date && (
            <p id="expiration_date-error" className={styles.error}>
              {errors.expiration_date}
            </p>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.button} disabled={isSaving}>
          {isSaving ? "Saving…" : "Add Food"}
        </button>
        <Link href="/menu" className={styles.link}>
          View Inventory on Menu
        </Link>
      </div>

      {/* aria-live announces these messages to screen readers when they appear */}
      <div aria-live="polite" className={styles.statusRegion}>
        {isSaving && <p className={styles.hint}>Saving your item…</p>}
        {status === "success" && (
          <p className={`${styles.status} ${styles.success}`}>
            Added {lastSavedName}.{" "}
            <Link href="/menu" className={styles.link}>
              See it on Menu
            </Link>
          </p>
        )}
        {status === "error" && (
          <p className={`${styles.status} ${styles.failure}`} role="alert">
            {serverMessage}
          </p>
        )}
      </div>
    </form>
  );
}
