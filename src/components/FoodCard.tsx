import { FoodItem } from "@/types/foodItem";
import styles from "./food-card.module.css";

type FoodCardProps = {
  item: FoodItem;
};

export default function FoodCard({ item }: FoodCardProps) {
  // Zero is a valid inventory value, but it should be shown as an availability status instead of a quantity.
  const isOutOfStock = item.quantity === 0;

  return (
    <article className={styles.foodcard}>
      <h2>{item.name}</h2>
      <p>Category: {item.category}</p>
      {/* Make unavailable items immediately understandable to visitors scanning the menu. */}
      {isOutOfStock ? (
        <p className={`${styles.availability} ${styles.outOfStock}`}>Out of stock</p>
      ) : (
        <p className={styles.availability}>Quantity: {item.quantity}</p>
      )}
      <p>Best by: {new Date(item.expiration_date).toLocaleDateString()}</p>
    </article>
  );
}
