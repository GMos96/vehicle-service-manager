"use client";

import { Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <Flex justify="space-between" height="20" padding="4">
      <Flex gap="4" alignItems="center">
        <b>Vehicle Service Manager</b>
      </Flex>
      <Flex gap="4" alignItems="center">
        <Button onClick={() => router.push("/login")}>Log In</Button>
        <Button onClick={() => router.push("/register")}>Sign Up</Button>
      </Flex>
    </Flex>
  );
}
