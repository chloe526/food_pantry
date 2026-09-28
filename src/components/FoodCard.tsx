import { FoodItem } from "@/types/foodItem";
import styles from "./food-card.module.css";

type FoodCardProps = {
  item: FoodItem;
};

export default function FoodCard({ item }: FoodCardProps) {
  return (
    <div className={styles.foodcard}>
      <h2>{item.name}</h2>
      <p>Category: {item.category}</p>
      <p>Quantity: {item.quantity}</p>
      <p>Best by: {item.expiration_date}</p>
    </div>
  );
}
