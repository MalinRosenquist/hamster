"use client";

import { SetListsContext } from "@/contexts/SetListsContext";
import { LS_SET_LISTS } from "@/lib/storage/storageKeys";
import SetListsReducer from "@/reducers/SetListsReducer";
import { useEffect, useMemo, useReducer } from "react";

function initSetListsState() {
  const fallback = { watchlistIds: [], collectionIds: [] };

  if (typeof window === "undefined") return fallback;

  try {
    const stored = localStorage.getItem(LS_SET_LISTS);
    if (!stored) return fallback;

    const parsed = JSON.parse(stored) as {
      watchlistIds?: unknown;
      collectionIds?: unknown;
    };

    // Validate: only accept arrays, and keep only string ids.
    // This prevents broken/old storage values from crashing the app
    return {
      watchlistIds: Array.isArray(parsed.watchlistIds)
        ? parsed.watchlistIds.filter(
            (setId): setId is string => typeof setId === "string"
          )
        : [],
      collectionIds: Array.isArray(parsed.collectionIds)
        ? parsed.collectionIds.filter(
            (setId): setId is string => typeof setId === "string"
          )
        : [],
    };
  } catch {
    return fallback;
  }
}

export default function SetListsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(
    SetListsReducer,
    undefined,
    initSetListsState
  );

  // Runs whenever watchlistIds or colletionIds change, to save to localStorage
  useEffect(() => {
    const payload = {
      watchlistIds: state.watchlistIds,
      collectionIds: state.collectionIds,
    };

    localStorage.setItem(LS_SET_LISTS, JSON.stringify(payload));
  }, [state.watchlistIds, state.collectionIds]);

  const counts = useMemo(
    () => ({
      collection: state.collectionIds.length,
      watchlist: state.watchlistIds.length,
    }),
    [state.collectionIds, state.watchlistIds]
  );

  return (
    <SetListsContext.Provider value={{ ...state, counts, dispatch }}>
      {children}
    </SetListsContext.Provider>
  );
}
