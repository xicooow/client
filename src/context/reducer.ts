import { State, Action } from "../types";

export const initialState: State = {
  user: { _id: "" },
};

export default (state: State, action: Action): State => {
  const { type } = action;

  switch (type) {
    case "SET_USER":
      return { ...state, user: { ...action.payload } };
    case "CLEANUP":
      return initialState;
    default:
      return state;
  }
};
