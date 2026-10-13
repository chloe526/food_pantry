import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import WishlistItemModel from "@/database/wishlistSchema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const wishlistItems = await WishlistItemModel.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(wishlistItems, { status: 200 });
  } catch (error) {
    console.error("Unable to load wishlist requests:", error);
    return NextResponse.json({ error: "Unable to load wishlist requests." }, { status: 500 });
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
  if (typeof item.category !== "string" || item.category.trim() === "") {
    errors.push("Category is required and must be a non-empty string");
  }
  if (typeof item.quantity !== "number" || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
    errors.push("Quantity is required and must be a positive whole nnumber");
  }
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
  }

  try {
    await connectDB();
    const newItem = await WishlistItemModel.create({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Unable to create wishlist request:", error);
    return NextResponse.json({ error: "Unable to create wishlist request." }, { status: 500 });
  }
}
