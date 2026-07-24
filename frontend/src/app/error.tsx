"use client";

import { useEffect } from "react";
import { Flex, HStack, Heading, Stack, Text } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Flex minH="calc(100dvh - 80px)" align="center" justify="center" py={10} px={4}>
      <Stack gap={3} textAlign="center" maxW="sm">
        <Text
          fontFamily="mono"
          fontSize="sm"
          color="accent.solidColor"
          letterSpacing="0.08em"
          textTransform="uppercase"
        >
          Something went wrong
        </Text>
        <Heading fontFamily="heading" fontSize="2xl">
          We hit a snag
        </Heading>
        <Text color="fg.muted">
          An unexpected error occurred. You can try again, or head back to
          your garage.
        </Text>
        <HStack justify="center" gap={3} pt={2}>
          <Button variant="outline" onClick={() => router.push("/vehicles")}>
            Back to Garage
          </Button>
          <Button onClick={() => reset()}>Try Again</Button>
        </HStack>
      </Stack>
    </Flex>
  );
}
