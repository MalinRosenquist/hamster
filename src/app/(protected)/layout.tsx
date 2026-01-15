"use client";

import { hasStoredUser } from "@/lib/authLocalStorage";
import styles from "./Layout.module.scss";
import Spinner from "@/components/Spinner/Spinner";
import SetListsProvider from "@/providers/SetListsProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [hasUser] = useState<boolean>(() => hasStoredUser());

  useEffect(() => {
    if (!hasUser) router.replace("/login");
  }, [hasUser, router]);

  if (!hasUser) {
    return (
      <div className={styles.redirect} role="status" aria-live="polite">
        <p>Omdirigerar...</p>
        <Spinner size="default" />
      </div>
    );
  }

  return (
    <SetListsProvider>
      <main>{children}</main>
    </SetListsProvider>
  );
}
