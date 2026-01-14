"use client";

import Link from "next/link";
import styles from "./SetCard.module.scss";
import Image from "next/image";
import CardToggles from "../ListToggle/CardToggles/CardToggles";
import { SetItem } from "@/models/SetItem";

type SetCardSource = "categories" | "collection" | "watchlist";

type SetCardProps = {
  item: SetItem;
  source?: SetCardSource;
  categoryId?: number | string;
};

export default function SetCard({ item, source, categoryId }: SetCardProps) {
  // Build item detail URL to keep the right link highlighted in the nav.
  const href =
    source === "categories"
      ? `/items/${item.set_num}?from=categories${categoryId ? `&categoryId=${encodeURIComponent(String(categoryId))}` : ""}`
      : source
        ? `/items/${item.set_num}?from=${source}`
        : `/items/${item.set_num}`;

  return (
    <>
      <Link className={styles.card} prefetch={false} href={href}>
        <div className={styles.imgContainer}>
          {item.set_img_url ? (
            <Image
              src={item.set_img_url}
              alt=""
              fill
              sizes="180"
              className={styles.image}
              aria-hidden="true"
            />
          ) : (
            <Image
              src="/icons/no_photo.svg"
              alt=""
              width={40}
              height={40}
              aria-hidden="true"
            />
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.details}>
            <span className={styles.setNumber}>{item.set_num}</span>
            <span className={styles.title}>{item.name}</span>
          </div>
          <div
            className={styles.toggles}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <CardToggles setNum={item.set_num} />
          </div>
        </div>
      </Link>
    </>
  );
}
