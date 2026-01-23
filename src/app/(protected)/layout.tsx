"use client";

import SetListsProvider from "@/providers/SetListsProvider";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthed } = useAuth();

  useLayoutEffect(() => {
    if (!isAuthed) {
      router.replace("/login");
    }
  }, [isAuthed, router]);

  if (!isAuthed) return null;

  return <SetListsProvider>{children}</SetListsProvider>;
}
