import { FoodItem } from "@/types/foodItem";
import { inventory } from "@/data/mockFoodItems";
import FoodCard from "@/components/FoodCard";
import styles from "@/app/menu/page.module.css";

export default function MenuPage() {
  if (!inventory || inventory.length === 0) {
    return <p>The food pantry is currently out of stock</p>;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Pantry Menu</h1>
          <p className={styles.subtitle}>Current inventory—updated regularly.</p>
          <hr className={styles.divider} />
        </div>
        <main className={styles.menuGrid}>
          {inventory.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </main>
      </div>
    </div>
  );
}
