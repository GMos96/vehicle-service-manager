import { Flex, Spinner } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Flex justify="center" py={20}>
      <Spinner color="accent.solidColor" />
    </Flex>
  );
}
