import { FoodItem } from "@/types/foodItem";
import { inventory } from "@/data/mockFoodItems";
import FoodCard from "@/components/FoodCard";
import styles from "@/app/menu/page.module.css";

export default function MenuPage() {
  if (!inventory || inventory.length === 0) {
    return <p>The food pantry is currently out of stock</p>;
  }

  return (
    <main className={styles.menuGrid}>
      {inventory.map((item) => (
        <FoodCard key={item.id} item={item} />
      ))}
    </main>
  );
}
