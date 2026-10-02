import { FoodItem } from "@/types/foodItem";

export const inventory: FoodItem[] = [
  { id: "abc123", name: "Canned Beans", expiration_date: new Date(2030, 9, 26), category: "Protein", quantity: 25 },
  { id: "tuv926", name: "Peanut Butter", expiration_date: new Date(2026, 10, 26), category: "Protein", quantity: 20 },
  { id: "icu111", name: "Carrot", expiration_date: new Date(2026, 10, 1), category: "Vegetable", quantity: 30 },
  { id: "nod135", name: "Noodles", expiration_date: new Date(2027, 9, 26), category: "Grain", quantity: 20 },
  { id: "abc123", name: "Canned Peas ", expiration_date: new Date(2028, 9, 26), category: "Vegetable", quantity: 25 },
];
