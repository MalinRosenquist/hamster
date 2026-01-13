"use client";

import { useContext } from "react";
import { SetListsContext } from "@/contexts/SetListsContext";
import SetList from "@/components/SavedSetList/SavedSetList";

export default function CollectionSection() {
  const { collectionIds } = useContext(SetListsContext);

  return <SetList ids={collectionIds} emptyText="Din samling är tom." />;
}
