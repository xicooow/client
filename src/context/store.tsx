import {
  useReducer,
  useContext,
  createContext,
  PropsWithChildren,
  FunctionComponent,
} from "react";

import reducer, { initialState } from "./reducer";
import { Context, State, Methods } from "../types";

const StoreContext = createContext<Context>({
  data: initialState,
});

const StoreProvider = StoreContext.Provider;

export const Store: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setUser = (user: State["user"]) => {
    dispatch({
      type: "SET_USER",
      payload: { ...user },
    });
  };

  const cleanup = () => {
    dispatch({ type: "CLEANUP" });
  };

  const value: Context = {
    data: state,
    methods: {
      setUser,
      cleanup,
    },
  };

  return <StoreProvider value={value}>{children}</StoreProvider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("useStore must be used within StoreContext");
  }

  return {
    ...context.data,
    ...(context.methods as Methods),
  };
};
