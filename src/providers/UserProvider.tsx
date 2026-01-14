"use client";

import { UserContext } from "@/contexts/UserContext";
import { LS_USER_NAME } from "@/lib/storageKeys";
import UserReducer from "@/reducers/UserReducer";
import { useEffect, useReducer } from "react";

export default function UserProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from localStorage on the client, keeps auth + UI in sync on first render
  const [userName, dispatch] = useReducer(UserReducer, null, () =>
    typeof window === "undefined" ? null : localStorage.getItem(LS_USER_NAME)
  );

  // Persist changes back to localStorage whenever the username changes.
  // - null = "logged out / cleared" -> remove the key
  // - otherwise store the current username
  useEffect(() => {
    if (userName === null) {
      localStorage.removeItem(LS_USER_NAME);
    } else {
      localStorage.setItem(LS_USER_NAME, userName);
    }
  }, [userName]);

  return (
    <UserContext.Provider value={{ userName, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}
