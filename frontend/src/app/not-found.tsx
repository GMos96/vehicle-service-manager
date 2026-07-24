import { Center, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import Link from "@/components/ui/link";

export default function NotFound() {
  return (
    <Flex minH="calc(100dvh - 80px)" align="center" justify="center" py={10} px={4}>
      <Stack gap={3} textAlign="center">
        <Text
          fontFamily="mono"
          fontSize="sm"
          color="accent.solidColor"
          letterSpacing="0.08em"
          textTransform="uppercase"
        >
          404
        </Text>
        <Heading fontFamily="heading" fontSize="2xl">
          Page not found
        </Heading>
        <Text color="fg.muted">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </Text>
        <Center>
          <Link href="/vehicles">Back to My Garage</Link>
        </Center>
      </Stack>
    </Flex>
  );
}
