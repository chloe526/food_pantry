"use client";

import { useState, type FormEvent } from "react";
import Navbar from "../../components/Navbar";

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

    setItems([...items, newItem]);

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
    <>
      <Navbar />

      <main>
        <h1>CalPoly Food Pantry Wishlist</h1>
        <p>Request food items you would like the pantry to carry.</p>

        <form onSubmit={addItem}>
          <div>
            <label htmlFor="foodName">Food name</label>
            <input id="foodName" value={foodName} onChange={(event) => setFoodName(event.target.value)} />
          </div>

          <div>
            <label htmlFor="category">Category</label>
            <select id="category" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">Select a category</option>
              <option value="Produce">Produce</option>
              <option value="Pantry Staples">Pantry Staples</option>
              <option value="Meals">Meals</option>
              <option value="Snacks">Snacks</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="quantity">Requested quantity</label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </div>

          {error && <p>{error}</p>}

          <button type="submit">Add request</button>
        </form>

        <h2>Requested Items</h2>

        {items.length === 0 ? (
          <p>No wishlist requests yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>{item.available ? "Available" : "Unavailable"}</td>
                  <td>
                    <button type="button" onClick={() => changeAvailability(index)}>
                      Change availability
                    </button>

                    <button type="button" onClick={() => removeItem(index)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
}
