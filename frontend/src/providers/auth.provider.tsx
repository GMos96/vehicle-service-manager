"use client";

import { ReactNode, useEffect, useReducer } from "react";
import { AuthContext, AuthDispatchContext } from "@/core/context/auth.context";

const AUTH_STATUS_COOKIE = "vsm-authenticated";

function hasAuthStatusCookie(): boolean {
  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .some((cookie) => cookie.startsWith(`${AUTH_STATUS_COOKIE}=`));
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, dispatch] = useReducer(handleAuthentication, false);

  useEffect(() => {
    dispatch(hasAuthStatusCookie());
  }, []);

  function handleAuthentication(state: boolean, newState: boolean): boolean {
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
