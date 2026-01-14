"use client";

import styles from "./Layout.module.scss";
import Spinner from "@/components/Spinner/Spinner";
import { LS_USER_NAME } from "@/lib/storageKeys";
import SetListsProvider from "@/providers/SetListsProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Render-fas: avgör om vi *har* användare (client only)
  const hasUser =
    typeof window !== "undefined" &&
    Boolean(window.localStorage.getItem(LS_USER_NAME));

  // Redirect to login-page if username is false
  useEffect(() => {
    if (!hasUser) router.replace("/login");
  }, [hasUser, router]);

  // Block rendering of protected content
  if (!hasUser)
    return (
      <div className={styles.redirect} role="status" aria-live="polite">
        <p>Omdirigerar...</p>
        <Spinner size="default" />
      </div>
    );

  return (
    <SetListsProvider>
      <main>{children}</main>
    </SetListsProvider>
  );
}
