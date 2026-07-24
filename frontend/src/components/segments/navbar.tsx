"use client";

import { Box, Flex, HStack, Show, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext, AuthDispatchContext } from "@/core/context/auth.context";
import { Button } from "@/components/ui/button";
import { api } from "@/core/api";
import NextLink from "next/link";

export default function Navbar() {
  const router = useRouter();

  const isAuthenticated = useContext(AuthContext);
  const setAuthenticated = useContext(AuthDispatchContext);

  async function onLogout() {
    await api.post("/auth/logout");
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
            flexShrink={0}
          />
          <Text
            fontFamily="heading"
            fontWeight="700"
            fontSize="sm"
            letterSpacing="0.04em"
            color="fg.default"
            whiteSpace="nowrap"
          >
            <Box as="span" display={{ base: "none", md: "inline" }}>
              VEHICLE SERVICE MANAGER
            </Box>
            <Box as="span" display={{ base: "inline", md: "none" }}>
              VSM
            </Box>
          </Text>
        </HStack>
      </NextLink>
      <Show
        when={!isAuthenticated}
        fallback={<LogoutButton onLogout={onLogout} />}
      >
        <HStack gap={{ base: 2, md: 4 }}>
          <Button
            variant="outline"
            size={{ base: "sm", md: "md" }}
            onClick={() => router.push("/login")}
            data-testid="navLoginButton"
          >
            Log In
          </Button>
          <Button
            size={{ base: "sm", md: "md" }}
            onClick={() => router.push("/register")}
            data-testid="navSignUpButton"
          >
            Sign Up
          </Button>
        </HStack>
      </Show>
    </Flex>
  );
}

function LogoutButton({ onLogout }: { onLogout: () => void }) {
  return (
    <HStack gap={4}>
      <Button variant="outline" onClick={onLogout} data-testid="navLogoutButton">
        Log Out
      </Button>
    </HStack>
  );
}
