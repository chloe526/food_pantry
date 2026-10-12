import type { Metadata } from "next";
import AddFoodForm from "@/components/AddFoodForm"; // or "../../components/AddFoodForm"
import styles from "./manage.module.css";

export const metadata: Metadata = {
  title: "Add Food",
};

export default function ManagePage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Add Food</h1>
      <p className={styles.intro}>Add an item to the inventory. All fields are required.</p>
      <AddFoodForm />
    </main>
  );
}
