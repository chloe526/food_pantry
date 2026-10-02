import mongoose, { Schema } from "mongoose";
import { WishlistItem } from "../types/wishlistItem";

const WishlistSchema = new Schema<WishlistItem>(
  {
    name: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
      minlength: [1, "Food name cannot be blank"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      minlength: [1, "Category cannot be blank"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Desired quantity cannot be negative"],
    },
  },
  { timestamps: true },
);

const WishlistItemModel = mongoose.models.WishlistItem || mongoose.model<WishlistItem>("Wishlist", WishlistSchema);
export default WishlistItemModel;
