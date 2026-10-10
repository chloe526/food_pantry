import { NextResponse } from "next/server";
import { inventory } from "../../../data/mockFoodItems";
import FoodItemModel from "@/database/foodSchema";
import mongoose from "mongoose";

let connection: typeof mongoose | undefined;

const createConnection = async () => {
  connection = connection ?? (await mongoose.connect(process.env.MONGO_URI as string));
  return connection;
};

//module.exports = createConnection;

export async function GET(request: Request, { params }: { params: { category: string } }) {
  //params isn't used currently but can be used later if we want the ability to search by category
  try {
    console.log("Mongo URI defined:", !!process.env.MONGO_URI);
    await createConnection();
    const pantry_inventory = await FoodItemModel.find({});
    return NextResponse.json(pantry_inventory, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let item;
  try {
    item = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload received." }, { status: 400 });
  }

  const errors: string[] = [];
  if (typeof item.name !== "string" || item.name.trim() === "") {
    errors.push("Name is required and must be a non-empty string");
  }
  if (typeof item.expiration_date !== "string") {
    //maybe change to if(!(item.expiration_date instanceof Date))
    errors.push("Expiration date is required and must be a string");
  } else if (isNaN(new Date(item.expiration_date).getTime())) {
    errors.push("Expiration date must be a valid date");
  }
  if (typeof item.category !== "string" || item.category.trim() === "") {
    errors.push("Category is required and must be a non-empty string");
  }
  if (typeof item.quantity !== "number" || item.quantity <= 0) {
    errors.push("Quantity is required and must be a positive number");
  }
  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    await createConnection();
    const newItem = await FoodItemModel.create({
      id: generateUniqueId(),
      name: item.name,
      expiration_date: item.expiration_date,
      category: item.category,
      quantity: item.quantity,
    });

    return NextResponse.json(newItem, { status: 201 });
    //return NextResponse.json(newItem, { status: 201 });
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
