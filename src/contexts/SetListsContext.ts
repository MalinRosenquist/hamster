import { SetListsAction } from "@/reducers/SetListsReducer";
import { createContext, Dispatch } from "react";

export type SetListsContextType = {
  watchlistIds: string[];
  collectionIds: string[];
  dispatch: Dispatch<SetListsAction>;
};

export const SetListsContext = createContext<SetListsContextType>({
  watchlistIds: [],
  collectionIds: [],
  dispatch: () => {},
});
