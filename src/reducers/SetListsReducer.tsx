export type SetListsState = {
  watchlistIds: string[];
  collectionIds: string[];
};

export enum SetListsActionTypes {
  SET_LISTS,
  TOGGLE_WATCHLIST,
  TOGGLE_COLLECTION,
}

export type SetListsAction =
  | {
      type: SetListsActionTypes.SET_LISTS;
      payload: { watchlistIds: string[]; collectionIds: string[] };
    }
  | { type: SetListsActionTypes.TOGGLE_WATCHLIST; payload: { id: string } }
  | { type: SetListsActionTypes.TOGGLE_COLLECTION; payload: { id: string } };

export default function SetListsReducer(
  state: SetListsState,
  action: SetListsAction
): SetListsState {
  switch (action.type) {
    case SetListsActionTypes.SET_LISTS: {
      return {
        ...state,
        watchlistIds: action.payload.watchlistIds,
        collectionIds: action.payload.collectionIds,
      };
    }

    case SetListsActionTypes.TOGGLE_WATCHLIST: {
      const id = action.payload.id;
      const inWatchlist = state.watchlistIds.includes(id);

      if (inWatchlist) {
        return {
          ...state,
          watchlistIds: state.watchlistIds.filter((s) => s !== id),
        };
      }
      return {
        watchlistIds: [...state.watchlistIds, id],
        collectionIds: state.collectionIds.filter((s) => s !== id),
      };
    }

    case SetListsActionTypes.TOGGLE_COLLECTION: {
      const id = action.payload.id;
      const inCollection = state.collectionIds.includes(id);

      if (inCollection) {
        return {
          ...state,
          collectionIds: state.collectionIds.filter((s) => s !== id),
        };
      }
      return {
        collectionIds: [...state.collectionIds, id],
        watchlistIds: state.watchlistIds.filter((s) => s != id!),
      };
    }

    default:
      return state;
  }
}
