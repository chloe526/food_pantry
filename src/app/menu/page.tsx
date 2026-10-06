"use client";

import { useEffect, useState } from "react";
import FoodCard from "@/components/FoodCard";
import type { FoodItem } from "@/types/foodItem";
import styles from "@/app/menu/page.module.css";

export default function MenuPage() {
  // Keep request state separate so an empty response is not mistaken for data that is still loading.
  const [items, setItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  // These states control the client-side name search and category filter.
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Load the current inventory and safely stop the request if the visitor leaves the page.
  useEffect(() => {
    const controller = new AbortController();

    async function loadInventory() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/items", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("The inventory request was unsuccessful.");
        }

        const data: unknown = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("The inventory response was not a list.");
        }

        setItems(data);
      } catch (caughtError) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("Unable to load pantry inventory:", caughtError);
        setError("We couldn't load the pantry inventory. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadInventory();

    return () => controller.abort();
  }, [requestVersion]);

  // Build filter choices from the most recently loaded inventory rather than a fixed category list.
  const categories = Array.from(new Set(items.map((item) => item.category))).sort();
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(normalizedQuery) &&
      (selectedCategory === "all" || item.category === selectedCategory),
  );

  // Let visitors quickly restore the full menu after a search returns no results.
  function clearFilters() {
    setSearchQuery("");
    setSelectedCategory("all");
  }

  // A new request version causes the inventory effect above to run again after an error.
  function retryLoadingInventory() {
    setRequestVersion((currentVersion) => currentVersion + 1);
  }

  return (
    <main className={styles.menu} aria-busy={isLoading}>
      <h1 className={styles.pageTitle}>Pantry Menu</h1>

      {/* Render each data state independently so visitors receive a clear explanation of what is happening. */}
      {isLoading ? (
        <p className={styles.statusMessage} role="status">
          Loading pantry inventory...
        </p>
      ) : error ? (
        <section className={`${styles.statusMessage} ${styles.errorState}`} role="alert">
          <p>{error}</p>
          <button className={styles.actionButton} type="button" onClick={retryLoadingInventory}>
            Try again
          </button>
        </section>
      ) : items.length === 0 ? (
        <p className={styles.statusMessage} role="status">
          The food pantry is currently out of stock.
        </p>
      ) : (
        <>
          {/* Filters appear only once there is inventory available to search. */}
          <section className={styles.filters} aria-label="Filter pantry inventory">
            <div className={styles.filterGroup}>
              <label htmlFor="food-name-search">Search by name</label>
              <input
                id="food-name-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search food items"
              />
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="food-category-filter">Category</label>
              <select
                id="food-category-filter"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <p className={styles.resultCount} aria-live="polite">
            {filteredItems.length} item{filteredItems.length === 1 ? "" : "s"} found
          </p>

          {filteredItems.length === 0 ? (
            <section className={styles.noResults} role="status">
              <p>No pantry items match your search or category filter.</p>
              <button className={styles.actionButton} type="button" onClick={clearFilters}>
                Clear filters
              </button>
            </section>
          ) : (
            <section className={styles.menuGrid} aria-label="Available food items">
              {filteredItems.map((item) => (
                <FoodCard key={item.id + item.name} item={item} />
              ))}
            </section>
          )}
        </>
      )}
    </main>
  );
}
