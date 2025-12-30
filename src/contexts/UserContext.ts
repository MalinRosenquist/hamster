import { UserAction } from "@/reducers/UserReducer";
import { createContext, type Dispatch } from "react";

export type UserContextType = {
  userName: string | null;
  dispatch: Dispatch<UserAction>;
};

export const UserContext = createContext<UserContextType>({
  userName: null,
  dispatch: () => {},
});
