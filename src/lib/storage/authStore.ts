import {
  clearStoredUserName,
  getStoredUserName,
  setStoredUserName,
} from "@/lib/storage/authLocalStorage";
import { LS_USER_NAME } from "./storageKeys";

/**
 * Auth store (localStorage-based)
 *
 * localStorage is the "source of truth" for the username.
 *
 * This file adds two things on top of localStorage:
 *  1) A way for React components to "listen" for auth changes (subscribeAuth)
 *  2) Helper functions to update localStorage AND immediately update the UI (setUserName / clearUserName)
 *:
 *  - subscribe(listener): how to start/stop listening for changes
 *  - getSnapshot(): how to read the current value during render
 *  - getServerSnapshot(): what to return during SSR (server can't read localStorage)
 */

type Listener = () => void;
const listeners = new Set<Listener>();

function notifyAuthChanged() {
  for (const listener of listeners) listener();
}

/**
 * Subscribe to auth changes (localStorage changes).
 */
export function subscribeAuth(listener: Listener) {
  listeners.add(listener);

  const onStorage = (e: StorageEvent) => {
    // Only react to changes affecting localStorage userName.
    if (e.storageArea !== window.localStorage) return;
    if (e.key === LS_USER_NAME) notifyAuthChanged();
  };

  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Client snapshot (reads localStorage) */
export function getAuthSnapshot(): string | null {
  return getStoredUserName();
}

/** Server snapshot (must be stable; server can't read localStorage) */
export function getAuthServerSnapshot(): string | null {
  return null;
}

/**
 * Public actions used by the app:
 * - update localStorage
 * - notify React so the UI updates immediately (in the same tab)
 */
export function authSetUserName(name: string) {
  setStoredUserName(name);
  notifyAuthChanged();
}

export function authClearUserName() {
  clearStoredUserName();
  notifyAuthChanged();
}
