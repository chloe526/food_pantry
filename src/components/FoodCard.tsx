import { FoodItem } from "@/types/foodItem";
import styles from "./food-card.module.css";

type FoodCardProps = {
  item: FoodItem;
};

export default function FoodCard({ item }: FoodCardProps) {
  return (
    <div className={styles.foodcard}>
      <h2 className={styles.itemName}>{item.name}</h2>
      <div className={styles.categoryWrapper}>
        <span className={styles.category}>{item.category}</span>
      </div>
      <hr className={styles.cardDivider} />
      <div className={styles.infoText}>
        <p>Quantity: {item.quantity}</p>
        <p>Best by: {item.expiration_date}</p>
      </div>
    </div>
  );
}
