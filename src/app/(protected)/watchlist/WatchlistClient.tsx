"use client";

import { useContext } from "react";
import { SetListsContext } from "@/contexts/SetListsContext";
import SavedSetList from "@/components/SavedSetList/SavedSetList";

export default function WatchlistClient() {
  const { watchlistIds } = useContext(SetListsContext);

  return (
    <SavedSetList
      ids={watchlistIds}
      emptyText="Du bevakar inget just nu."
      source="watchlist"
    />
  );
}
