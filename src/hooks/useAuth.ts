"use client";

import { useSyncExternalStore } from "react";
import {
  subscribeAuth,
  getAuthSnapshot,
  getAuthServerSnapshot,
} from "@/lib/storage/authStore";

/**
 * useAuth()
 *
 * Returns auth state:
 * - userName: string | null
 * - isAuthed: boolean
 *
 * Under the hood it uses useSyncExternalStore so that:
 * - SSR uses getAuthServerSnapshot() (always null)
 * - the browser uses getAuthSnapshot() (reads localStorage)
 * - when authStore notifies a change, React re-renders components using this hook
 */

export function useAuth() {
  const userName = useSyncExternalStore(
    subscribeAuth,
    getAuthSnapshot,
    getAuthServerSnapshot
  );

  return {
    userName,
    isAuthed: Boolean(userName),
  };
}
