"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Header.module.scss";

const links = [
  { href: "/", label: "Hem" },
  { href: "/categories", label: "Utforska" },
  { href: "/watchlist", label: "Bevaka" },
  { href: "/collection", label: "Samling" },
  { href: "/myPage", label: "Min sida" },
  { href: "/faq", label: "FAQ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={`${styles.logoName} logoName`}>
          Hamster
        </Link>

        <nav className={styles.nav} aria-label="Huvudnavigering">
          {/* DESKTOP */}
          <ul className={styles.desktopList}>
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* MOBILE */}
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="mobileMenu"
            aria-label={open ? "Stäng meny" : "Öppna meny"}
            onClick={() => setOpen((isOpen) => !isOpen)}
          >
            {open ? "✕" : "☰"}
          </button>
        </nav>
      </div>

      <div
        id="mobileMenu"
        className={`${styles.mobilePanel} ${open ? styles.open : ""}`}
        aria-hidden={!open}
      >
        <div className={styles.mobileInner}>
          <ul className={styles.mobileList}>
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={styles.link}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
