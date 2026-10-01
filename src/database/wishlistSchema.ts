import mongoose, { Schema } from "mongoose";
import { WishlistItem } from "../types/wishlistItem";

const WishlistSchema = new Schema<WishlistItem>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true },
);

const WishlistItemModel = mongoose.models.WishlistItem || mongoose.model<WishlistItem>("Wishlist", WishlistSchema);
export default WishlistItemModel;
