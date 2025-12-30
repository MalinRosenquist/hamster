"use client";

import { UserContext } from "@/contexts/UserContext";
import UserReducer, { UserActionTypes } from "@/reducers/UserReducer";
import { useEffect, useReducer } from "react";

const LS_USER_NAME = "hamster:userName";

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const [userName, dispatch] = useReducer(UserReducer, null);

  useEffect(() => {
    const saved = localStorage.getItem(LS_USER_NAME);
    if (saved) {
      dispatch({ type: UserActionTypes.SET_NAME, payload: saved });
    }
  }, []);

  useEffect(() => {
    if (userName === null) {
      localStorage.removeItem(LS_USER_NAME);
    } else {
      localStorage.setItem(LS_USER_NAME, userName);
    }
  }, [userName]);

  console.log("UserProvider userName:", userName);
  return (
    <UserContext.Provider value={{ userName, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}
