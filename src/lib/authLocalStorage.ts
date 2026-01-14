import { LS_USER_NAME } from "./storageKeys";

export function hasStoredUser(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem(LS_USER_NAME));
}

export function getStoredUserName(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(LS_USER_NAME);
}
