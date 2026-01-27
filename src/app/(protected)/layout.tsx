"use client";

import SetListsProvider from "@/providers/SetListsProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useHydrated } from "@/hooks/useHydrated";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthed } = useAuth();
  const hydrated = useHydrated();

  useEffect(() => {
    if (hydrated && !isAuthed) {
      router.replace("/login");
    }
  }, [hydrated, isAuthed, router]);

  if (!hydrated) return null;

  if (!isAuthed) return null;

  return <SetListsProvider>{children}</SetListsProvider>;
}
