"use client";

import styles from "./Layout.module.scss";
import Spinner from "@/components/Spinner/Spinner";
import SetListsProvider from "@/providers/SetListsProvider";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { UserContext } from "@/contexts/UserContext";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { userName } = useContext(UserContext);

  useEffect(() => {
    if (!userName) {
      router.replace("/login");
    }
  }, [userName, router]);

  if (!userName) {
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
