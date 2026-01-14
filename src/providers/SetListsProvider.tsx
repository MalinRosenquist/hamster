"use client";

import { SetListsContext } from "@/contexts/SetListsContext";
import { LS_SET_LISTS } from "@/lib/storageKeys";
import SetListsReducer, { SetListsActionTypes } from "@/reducers/SetListsReducer";
import { useEffect, useMemo, useReducer, useRef } from "react";

export default function SetListsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(SetListsReducer, {
    watchlistIds: [],
    collectionIds: [],
  });

  const hasLoadedfromStorage = useRef(false);

  // On mount, load saved lists from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_SET_LISTS);
      if (!stored) return;

      const parsed = JSON.parse(stored) as {
        watchlistIds?: unknown;
        collectionIds?: unknown;
      };

      dispatch({
        type: SetListsActionTypes.SET_LISTS,
        payload: {
          // Accept only arrays, otherwise default to empty arrays
          watchlistIds: Array.isArray(parsed.watchlistIds)
            ? parsed.watchlistIds
            : [],
          collectionIds: Array.isArray(parsed.collectionIds)
            ? parsed.collectionIds
            : [],
        },
      });
    } catch (error) {
      console.error("Failed to load set lists from localStorage", error);
    } finally {
      hasLoadedfromStorage.current = true;
    }
  }, []);

  // Runs whenever watchlistIds or colletionIds change, to save to localStorage
  useEffect(() => {
    if (!hasLoadedfromStorage.current) return;

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
