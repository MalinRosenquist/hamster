"use client";

import { useContext } from "react";
import { SetListsContext } from "@/contexts/SetListsContext";
import SavedSetList from "@/components/SavedSetList/SavedSetList";

export default function CollectionClient() {
  const { collectionIds } = useContext(SetListsContext);

  return (
    <SavedSetList
      ids={collectionIds}
      emptyText="Din samling är tom."
      source="collection"
    />
  );
}
