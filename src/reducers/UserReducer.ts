export enum UserActionTypes {
  SET_NAME,
  CLEAR_DATA,
}

export type UserAction =
  | { type: UserActionTypes.SET_NAME; payload: string }
  | { type: UserActionTypes.CLEAR_DATA };

export default function UserReducer(
  userName: string | null,
  action: UserAction
) {
  switch (action.type) {
    case UserActionTypes.SET_NAME:
      return action.payload;
    case UserActionTypes.CLEAR_DATA:
      return null;
    default:
      return userName;
  }
}
