import { SetListsAction } from "@/reducers/SetListsReducer";
import { createContext, Dispatch } from "react";

export type SetListsContextType = {
  watchlistIds: string[];
  collectionIds: string[];
  counts: {
    watchlist: number;
    collection: number;
  };
  dispatch: Dispatch<SetListsAction>;
};

export const SetListsContext = createContext<SetListsContextType>({
  watchlistIds: [],
  collectionIds: [],
  counts: {
    watchlist: 0,
    collection: 0,
  },
  dispatch: () => {},
});
