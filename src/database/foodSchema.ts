import mongoose, { Schema } from "mongoose";
import { FoodItem } from "../types/foodItem.js";

const FoodSchema = new Schema<FoodItem>(
  {
    name: { type: String, required: true },
    expiration_date: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

const FoodItemModel = mongoose.models.FoodItem || mongoose.model<FoodItem>("Food", FoodSchema);
export default FoodItemModel;
