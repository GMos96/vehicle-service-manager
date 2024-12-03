"use client";

import { ReactNode, useEffect, useReducer } from "react";
import { AuthContext, AuthDispatchContext } from "@/core/context/auth.context";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, dispatch] = useReducer(handleAuthentication, false);

  useEffect(() => {
    const token = sessionStorage.getItem("vsm-token");
    dispatch(token !== null);
  }, []);

  function handleAuthentication(state: boolean, newState: boolean): boolean {
    if (!newState) {
      sessionStorage.removeItem("vsm-token");
    }
    return newState;
  }

  return (
    <AuthContext.Provider value={isAuthenticated}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
}
