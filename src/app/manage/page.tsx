import type { Metadata } from "next";
import AddFoodForm from "@/components/AddFoodForm";
import styles from "./manage.module.css";

export const metadata: Metadata = {
  title: "Add Food",
};

export default function ManagePage() {
  return (
    <main className={styles.page}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>Add Food</h1>
        <p className={styles.subtitle}>Add an item to the inventory. All fields are required.</p>
        <hr className={styles.divider} />
      </div>
      <AddFoodForm />
    </main>
  );
}
