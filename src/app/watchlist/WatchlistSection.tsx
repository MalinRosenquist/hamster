"use client";

import { useContext } from "react";
import { SetListsContext } from "@/contexts/SetListsContext";
import SetList from "@/components/SavedSetList/SavedSetList";

export default function WatchlistSection() {
  const { watchlistIds } = useContext(SetListsContext);

  return <SetList ids={watchlistIds} emptyText="Du bevakar inget just nu." />;
}
