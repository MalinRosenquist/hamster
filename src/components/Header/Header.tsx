"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Header.module.scss";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { href: "/", label: "Hem", protected: true },
  { href: "/categories", label: "Utforska", protected: true },
  { href: "/watchlist", label: "Bevaka", protected: true },
  { href: "/collection", label: "Samling", protected: true },
  { href: "/mypage", label: "Min sida", protected: true },
  { href: "/faq", label: "FAQ", protected: true },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthed } = useAuth();

  function isActive(href: string) {
    // Don't highlight anything unless authenticated (prevents "active" flash)
    if (!isAuthed) return false;

    // "/" must match exactly, otherwise it would be active on every route
    if (href === "/") return pathname === "/";

    // Keep parent section in nav active for nested routes (e.g. /categories/123 -> /categories)
    if (pathname.startsWith(href)) return true;

    // Use the "from" query param to decide which top level nav item should stay highlighted
    if (pathname.startsWith("/items/")) {
      const from = searchParams.get("from");

      if (from === "categories" && href === "/categories") return true;
      if (from === "collection" && href === "/collection") return true;
      if (from === "watchlist" && href === "/watchlist") return true;
    }

    return false;
  }

  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    isProtected: boolean
  ) {
    // Close mobile menu when navigating
    setOpen(false);

    // Client-side route guard: if not authed, prevent navigation and redirect to login page
    if (isProtected && !isAuthed) {
      e.preventDefault();
      router.replace("/login");
    }
  }

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link
          href="/"
          className={`${styles.logoName} logoName`}
          onClick={(e) => handleNavClick(e, true)}
        >
          <span>Hamster</span>
        </Link>

        <nav className={styles.nav} aria-label="Huvudnavigering">
          {/* DESKTOP */}
          <ul className={styles.desktopList}>
            {links.map((link) => {
              const active = isActive(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`navLink ${styles.navLink} ${
                      active ? styles.isActive : ""
                    }`}
                    onClick={(e) => handleNavClick(e, link.protected)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* MOBILE TOGGLE */}
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

      {/* MOBILE PANEL */}
      {open && (
        <>
          <button
            type="button"
            className={styles.backdrop}
            aria-label="Stäng meny"
            onClick={() => setOpen(false)}
          />

          <div
            id="mobileMenu"
            className={`${styles.mobilePanel} ${styles.open}`}
            aria-label="Mobilmeny"
          >
            <div className={styles.mobileInner}>
              <ul className={styles.mobileList}>
                {links.map((link) => {
                  const active = isActive(link.href);

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`navLink ${styles.navLink} ${
                          active ? styles.isActive : ""
                        }`}
                        onClick={(e) => handleNavClick(e, link.protected)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
