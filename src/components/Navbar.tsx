import styles from "./Navbar.module.css";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.siteTitle}>
        PolyPantry
      </Link>
      <ul className={styles.links}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/menu">Menu</Link>
        </li>
        <li>
          <Link href="/wishlist">Wishlist</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
}
