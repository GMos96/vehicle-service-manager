"use client";

import { Button, Flex, Show } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isAuthenticated, setAuthenticated] = useState<boolean>();

  useEffect(() => {
    if (sessionStorage.getItem("vsm-token")) {
      setAuthenticated(true);
    }
  }, []);

  function onLogout() {
    sessionStorage.removeItem("vsm-token");
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
