"use client";

import { useContext } from "react";
import { SetListsContext } from "@/contexts/SetListsContext";
import SavedSetList from "@/components/SavedSetList/SavedSetList";

export default function WatchlistSection() {
  const { watchlistIds } = useContext(SetListsContext);

  return (
    <SavedSetList
      ids={watchlistIds}
      emptyText="Du bevakar inget just nu."
      source="collection"
    />
  );
}
