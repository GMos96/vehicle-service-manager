"use client";

import { Box, Flex, HStack, Show, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext, AuthDispatchContext } from "@/core/context/auth.context";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";

export default function Navbar() {
  const router = useRouter();

  const isAuthenticated = useContext(AuthContext);
  const setAuthenticated = useContext(AuthDispatchContext);

  function onLogout() {
    setAuthenticated(false);
    router.push("/login");
  }

  return (
    <Flex
      justify="space-between"
      align="center"
      h="20"
      px={{ base: 4, md: 10 }}
      borderBottomWidth="1px"
      borderBottomColor="border.hairline"
    >
      <NextLink href="/" style={{ textDecoration: "none" }}>
        <HStack gap={2.5}>
          <Box
            w="8px"
            h="8px"
            borderRadius="full"
            bg="accent.solidColor"
            boxShadow="0 0 6px 1px rgba(63,169,245,0.6)"
          />
          <Text
            fontFamily="heading"
            fontWeight="700"
            fontSize="sm"
            letterSpacing="0.04em"
            color="fg.default"
          >
            VEHICLE SERVICE MANAGER
          </Text>
        </HStack>
      </NextLink>
      <Show
        when={!isAuthenticated}
        fallback={<LogoutButton onLogout={onLogout} />}
      >
        <HStack gap={4}>
          <Button variant="outline" onClick={() => router.push("/login")}>
            Log In
          </Button>
          <Button onClick={() => router.push("/register")}>Sign Up</Button>
        </HStack>
      </Show>
    </Flex>
  );
}

function LogoutButton({ onLogout }: { onLogout: () => void }) {
  return (
    <HStack gap={4}>
      <Button variant="outline" onClick={onLogout}>
        Log Out
      </Button>
    </HStack>
  );
}
