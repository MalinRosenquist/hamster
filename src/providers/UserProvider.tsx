"use client";

import { UserContext } from "@/contexts/UserContext";
import {
  clearStoredUserName,
  getStoredUserName,
  setStoredUserName,
} from "@/lib/authLocalStorage";
import UserReducer from "@/reducers/UserReducer";
import { useEffect, useReducer } from "react";

export default function UserProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from localStorage on the client, keeps auth + UI in sync on first render
  const [userName, dispatch] = useReducer(UserReducer, null, () =>
    getStoredUserName()
  );

  // Persist changes back to localStorage whenever the username changes.
  useEffect(() => {
    if (userName === null) {
      clearStoredUserName();
    } else {
      setStoredUserName(userName);
    }
  }, [userName]);

  return (
    <UserContext.Provider value={{ userName, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}
