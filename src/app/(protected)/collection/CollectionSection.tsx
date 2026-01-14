"use client";

import { useContext } from "react";
import { SetListsContext } from "@/contexts/SetListsContext";
import SavedSetList from "@/components/SavedSetList/SavedSetList";

export default function CollectionSection() {
  const { collectionIds } = useContext(SetListsContext);

  return (
    <SavedSetList
      ids={collectionIds}
      emptyText="Din samling är tom."
      source="collection"
    />
  );
}
