"use client";

import { Button, Flex, Show } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext, AuthDispatchContext } from "@/core/context/auth.context";

export default function Navbar() {
  const router = useRouter();

  const isAuthenticated = useContext(AuthContext);
  const setAuthenticated = useContext(AuthDispatchContext);

  function onLogout() {
    setAuthenticated(false);
    router.push("/login");
  }

  return (
    <Flex justify="space-between" height="20" padding="4">
      <Flex gap="4" alignItems="center">
        <b>Vehicle Service Manager</b>
      </Flex>
      <Show
        when={!isAuthenticated}
        fallback={<LogoutButton onLogout={onLogout} />}
      >
        <Flex gap="4" alignItems="center">
          <Button onClick={() => router.push("/login")}>Log In</Button>
          <Button onClick={() => router.push("/register")}>Sign Up</Button>
        </Flex>
      </Show>
    </Flex>
  );
}

function LogoutButton({ onLogout }: { onLogout: () => void }) {
  return (
    <Flex gap="4" alignItems="center">
      <Button onClick={onLogout}>Log Out</Button>
    </Flex>
  );
}
