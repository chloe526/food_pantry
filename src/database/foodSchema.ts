import mongoose, { Schema } from "mongoose";
import { FoodItem } from "../types/foodItem.js";

const FoodSchema = new Schema<FoodItem>(
  {
    id: { type: String, required: true, unique: true },
    name: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
      minlength: [1, "Food name cannot be blank"],
    },
    expiration_date: {
      type: Date,
      required: [true, "Expiration date is required"],
      validate: {
        validator: (value: Date) => {
          return value instanceof Date && !isNaN(value.getTime());
        },
        message: "Please provide a valid expiration date",
      },
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
      min: [0, "Inventory quantity cannot be negative"],
    },
  },
  { timestamps: true },
);

const FoodItemModel = mongoose.models.FoodItem || mongoose.model<FoodItem>("Food", FoodSchema);

export default FoodItemModel;
