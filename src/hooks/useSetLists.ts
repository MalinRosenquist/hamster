"use client";

import { SetListsContext } from "@/contexts/SetListsContext";
import { SetListsActionTypes } from "@/reducers/SetListsReducer";
import { useContext } from "react";

export function useSetLists(setNum: string) {
  const { watchlistIds, collectionIds, dispatch } = useContext(SetListsContext);

  const id = String(setNum);

  const isWatching = watchlistIds.includes(id);
  const isCollected = collectionIds.includes(id);

  function toggleWatchlist() {
    dispatch({ type: SetListsActionTypes.TOGGLE_WATCHLIST, payload: { id } });
  }

  function toggleCollection() {
    dispatch({ type: SetListsActionTypes.TOGGLE_COLLECTION, payload: { id } });
  }

  return {
    isWatching,
    isCollected,
    toggleWatchlist,
    toggleCollection,
  };
}
