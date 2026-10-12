"use client";

import { useEffect, useState, type FormEvent } from "react";
import styles from "./Wishlist.module.css";

type WishlistItem = {
  _id: string;
  name: string;
  category: string;
  quantity: number;
};

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [foodName, setFoodName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadItems() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/wishlist");

        if (!response.ok) {
          throw new Error("Could not load wishlist requests.");
        }

        const data = await response.json();
        setItems(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Could not load wishlist requests.");
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, []);

  async function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanFoodName = foodName.trim();
    const cleanCategory = category.trim();
    const requestedQuantity = Number(quantity);

    if (!cleanFoodName || !cleanCategory || quantity === "") {
      setError("Please fill out every field.");
      return;
    }

    if (!Number.isInteger(requestedQuantity) || requestedQuantity <= 0) {
      setError("Quantity must be a positive whole number.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: cleanFoodName,
          category: cleanCategory,
          quantity: requestedQuantity,
        }),
      });

      const newItem = await response.json();

      if (!response.ok) {
        throw new Error(newItem.error || "Could not save wishlist request.");
      }

      setItems((currentItems) => [newItem, ...currentItems]);

      setFoodName("");
      setCategory("");
      setQuantity("");
      setSuccess("Your wishlist request was added.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not save wishlist request.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.container}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>Wishlist</h1>
          <p className={styles.subtitle}>Request food items you would like the pantry to carry.</p>
          <hr className={styles.divider} />
        </div>

        <form onSubmit={addItem} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label htmlFor="foodName" className={styles.label}>
              FOOD NAME
            </label>
            <input
              id="foodName"
              value={foodName}
              className={styles.textInput}
              onChange={(event) => setFoodName(event.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="category" className={styles.label}>
              CATEGORY
            </label>
            <select
              id="category"
              value={category}
              className={styles.selectInput}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">Select a category</option>
              <option value="Produce">Produce</option>
              <option value="Pantry Staples">Pantry Staples</option>
              <option value="Meals">Meals</option>
              <option value="Snacks">Snacks</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="quantity" className={styles.label}>
              REQUESTED QUANTITY
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              step="1"
              value={quantity}
              className={styles.textInput}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </div>

          {error && <p role="alert">{error}</p>}
          {success && <p>{success}</p>}

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Add request"}
          </button>
        </form>

        <h2>Requested Items</h2>

        {loading ? (
          <p>Loading wishlist requests...</p>
        ) : items.length === 0 ? (
          <p>No wishlist requests yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Quantity</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
