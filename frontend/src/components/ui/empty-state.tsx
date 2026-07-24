import { Box, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { LuBox } from "react-icons/lu";

type Props = {
  icon?: ReactNode;
  message: ReactNode;
  height?: number | string;
};

export default function EmptyState({ icon, message, height = 300 }: Props) {
  return (
    <VStack
      justify="center"
      textAlign="center"
      gap={2}
      h={height}
      borderWidth="1px"
      borderColor="border.hairline"
      borderRadius="md"
      bg="bg.panel"
      color="fg.subtle"
    >
      {icon ?? <LuBox size={20} />}
      <Box
        fontFamily="mono"
        fontSize="xs"
        letterSpacing="0.08em"
        textTransform="uppercase"
      >
        {message}
      </Box>
    </VStack>
  );
}
