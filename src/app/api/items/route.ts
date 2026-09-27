import { NextResponse } from "next/server";
import { inventory } from "../../../data/mockFoodItems";

export async function GET() {
  return NextResponse.json(inventory, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const item = await request.json();

    const errors: string[] = [];
    if (typeof item.name !== "string" || item.name.trim() === "") {
      errors.push("Name is required and must be a non-empty string");
    }
    if (typeof item.expiration_date !== "string") {
      errors.push("Expiration date is required and must be a string");
    }
    if (typeof item.category !== "string" || item.category.trim() === "") {
      errors.push("Category is required and must be a non-empty string");
    }
    if (typeof item.quantity !== "number" || item.quantity < 0) {
      errors.push("Quantity is required and must be a positive number");
    }
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const newItem = {
      id: generateUniqueId(),
      name: item.name,
      expiration_date: item.expiration_date,
      category: item.category,
      quantity: item.quantity,
    };

    inventory.push(newItem);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON payload received." }, { status: 400 });
  }
}

const generateUniqueId = () => {
  let id: string;

  do {
    const letters = Array.from({ length: 3 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join("");

    const numbers = Math.floor(Math.random() * 1000).toString();

    id = letters + numbers;
  } while (inventory.some((item) => item.id === id));

  return id;
};
