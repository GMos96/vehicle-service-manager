import { Table as ChakraTable, TableRow } from "@chakra-ui/react/table";
import { ReactNode } from "react";
import { Box, Flex, Show, Spinner, VStack } from "@chakra-ui/react";
import { LuBox } from "react-icons/lu";

type Props = ChakraTable.RootProps & {
  headerRow: ReactNode;
  loading: boolean;
  customNoRecordsFound?: ReactNode;
  data: unknown[];
};

function TableRoot({
  size = "md",
  interactive,
  headerRow,
  loading,
  customNoRecordsFound,
  children,
  data,
}: Props) {
  const noRecordsFound = customNoRecordsFound ?? defaultNoRecordsFound();

  return (
    <>
      <Show
        when={data?.length}
        fallback={fallback({ loading, noRecordsFound })}
      >
        <ChakraTable.Root
          size={size}
          variant="outline"
          interactive={interactive}
        >
          <ChakraTable.Header>{headerRow}</ChakraTable.Header>
          <ChakraTable.Body>{children}</ChakraTable.Body>
        </ChakraTable.Root>
      </Show>
    </>
  );
}

type FallbackProps = {
  loading: boolean;
  noRecordsFound: ReactNode;
};
function fallback({ loading, noRecordsFound }: FallbackProps) {
  return (
    <Show when={loading} fallback={noRecordsFound}>
      <Box borderWidth={2} borderRadius={4}>
        <Flex justify="center" align="center" h={300}>
          <VStack>
            <Spinner></Spinner> Loading...
          </VStack>
        </Flex>
      </Box>
    </Show>
  );
}

const defaultNoRecordsFound: () => ReactNode = () => (
  <VStack justify="center" textAlign="center" fontWeight="medium" h={300}>
    <LuBox></LuBox>
    <span>No Records found</span>
  </VStack>
);

const Table = {
  Header: ChakraTable.Header,
  Root: TableRoot,
  Row: TableRow,
  ColumnHeader: ChakraTable.ColumnHeader,
  Cell: ChakraTable.Cell,
};

export default Table;
