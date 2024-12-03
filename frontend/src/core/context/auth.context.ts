import { createContext, Dispatch } from "react";

export const AuthContext = createContext(false);
export const AuthDispatchContext = createContext<Dispatch<boolean>>(
  (state) => state,
);
