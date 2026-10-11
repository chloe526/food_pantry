"use client";

import { useState, type FormEvent } from "react";
import styles from "./Wishlist.module.css";

export default function WishlistPage() {
  const [items, setItems] = useState([
    {
      name: "Avocado",
      category: "Produce",
      quantity: 2,
      available: true,
    },
    {
      name: "Cooking Oil",
      category: "Pantry Staples",
      quantity: 3,
      available: false,
    },
    {
      name: "Beijing Beef",
      category: "Meals",
      quantity: 1,
      available: false,
    },
  ]);

  const [foodName, setFoodName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");

  // just so it doesn't reload into a new page everytime form submits
  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (foodName === "" || category === "" || quantity === "") {
      setError("Please fill out every field.");
      return;
    }

    if (Number(quantity) <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }

    const newItem = {
      name: foodName,
      category: category,
      quantity: Number(quantity),
      available: false,
    };
    // this is to check whether an inputted item already exists before adding it to the user's wishlist
    const existingItemIndex = items.findIndex((item) => {
      return item.name.toLowerCase() === foodName.toLowerCase();
    });

    if (existingItemIndex !== -1) {
      const updatedItems = [...items];

      updatedItems[existingItemIndex].quantity += Number(quantity);

      setItems(updatedItems);
    } else {
      setItems([...items, newItem]);
    }

    setFoodName("");
    setCategory("");
    setQuantity("");
    setError("");
  }

  function removeItem(index: number) {
    const updatedItems = items.filter((item, itemIndex) => {
      return itemIndex !== index;
    });

    setItems(updatedItems);
  }

  function changeAvailability(index: number) {
    const updatedItems = [...items];

    updatedItems[index].available = !updatedItems[index].available;

    setItems(updatedItems);
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
              value={quantity}
              className={styles.textInput}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </div>

          {error && <p>{error}</p>}

          <div className={styles.buttonWrapper}>
            <button type="submit" className={styles.submitButton}>
              Submit Request
            </button>
          </div>
        </form>

        <div className={styles.tableSection}>
          <h2 className={styles.sectionTitle}>Requested Items:</h2>

          {items.length === 0 ? (
            <p className={styles.emptyMessage}>No wishlist requests yet.</p>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ITEM</th>
                    <th>CATEGORY</th>
                    <th>QUANTITY</th>
                    <th>AVAILABILITY</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td className={styles.itemName}>{item.name}</td>
                      <td>
                        <span className={styles.category}>{item.category}</span>
                      </td>
                      <td className={styles.quantityText}>{item.quantity}</td>
                      <td>
                        <span className={item.available ? styles.statusAvailable : styles.statusUnavailable}>
                          {item.available ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className={styles.actionButtons}>
                        <button type="button" className={styles.toggleButton} onClick={() => changeAvailability(index)}>
                          Change availability
                        </button>

                        <button type="button" className={styles.removeButton} onClick={() => removeItem(index)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
