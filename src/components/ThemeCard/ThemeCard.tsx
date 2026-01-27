"use client";

import Link from "next/link";
import styles from "./ThemeCard.module.scss";
import Image from "next/image";
import { ThemeWithThumb } from "@/models/ThemeWithThumb";
import { useSearchParams } from "next/navigation";

type ThemeCardProps = {
  theme: ThemeWithThumb;
};

export default function ThemeCard({ theme }: ThemeCardProps) {
  const searchParams = useSearchParams();

  return (
    <>
      <Link
        data-testid={`theme-card-${theme.id}`}
        className={styles.card}
        prefetch={false}
        href={{
          pathname: `/categories/${theme.id}`,
          query: Object.fromEntries(searchParams.entries()),
        }}
      >
        <div className={styles.imgContainer}>
          {theme.thumb ? (
            <Image
              src={theme.thumb}
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
            <span className={styles.title}>{theme.name}</span>
          </div>
        </div>
      </Link>
    </>
  );
}
