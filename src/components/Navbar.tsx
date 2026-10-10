"use client";

import styles from "./Navbar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/menu", label: "Menu" },
    { href: "/wishlist", label: "Wishlist" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.siteTitle}>
        PolyPantry
      </Link>
      <ul className={styles.links}>
        {navLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <li key={link.href}>
              <Link href={link.href} className={isActive ? styles.active : ""}>
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
