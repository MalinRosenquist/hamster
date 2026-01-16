"use client";

import styles from "./LoadMore.module.scss";
import Button from "@/components/Buttons/Button/Button";
import { ReactNode } from "react";

type LoadMoreProps = {
  shown: number;
  total: number;
  loading?: boolean;
  canLoadMore: boolean;
  onLoadMore: () => void;
  children: ReactNode;
};

export default function LoadMore({
  shown,
  total,
  loading = false,
  canLoadMore,
  onLoadMore,
  children,
}: LoadMoreProps) {
  return (
    <div className={styles.loaderWrapper}>
      <p>
        Visar {shown} av {total}
      </p>
      <Button
        variant="secondary"
        type="button"
        onClick={onLoadMore}
        disabled={!canLoadMore || loading}
      >
        {loading ? "Hämtar..." : children}
      </Button>
    </div>
  );
}
