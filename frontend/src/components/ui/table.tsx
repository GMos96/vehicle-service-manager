import { Table as ChakraTable, TableRow } from "@chakra-ui/react/table";
import { ReactNode } from "react";
import { Box, Flex, Show, Spinner, VStack } from "@chakra-ui/react";
import EmptyState from "@/components/ui/empty-state";

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
          borderWidth="1px"
          borderColor="border.hairline"
          borderRadius="md"
          css={{
            "& thead tr": {
              borderBottomColor: "var(--chakra-colors-border-hairline)",
            },
            "& th": {
              fontFamily: "var(--font-mono)",
              fontSize: "xs",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--chakra-colors-fg-subtle)",
              fontWeight: 500,
            },
            "& tbody tr": {
              borderBottomColor: "var(--chakra-colors-border-hairline)",
            },
            "& tbody tr:last-of-type": {
              borderBottomWidth: 0,
            },
            "& tbody tr:hover": interactive
              ? { backgroundColor: "var(--chakra-colors-bg-panel-raised)" }
              : undefined,
          }}
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
      <Box
        borderWidth="1px"
        borderColor="border.hairline"
        borderRadius="md"
        bg="bg.panel"
      >
        <Flex justify="center" align="center" h={300}>
          <VStack>
            <Spinner color="accent.solidColor"></Spinner>
            <Box
              fontFamily="mono"
              fontSize="xs"
              letterSpacing="0.08em"
              textTransform="uppercase"
              color="fg.subtle"
            >
              Loading
            </Box>
          </VStack>
        </Flex>
      </Box>
    </Show>
  );
}

const defaultNoRecordsFound: () => ReactNode = () => (
  <EmptyState message="No records found" />
);

const Table = {
  Header: ChakraTable.Header,
  Root: TableRoot,
  Row: TableRow,
  ColumnHeader: ChakraTable.ColumnHeader,
  Cell: ChakraTable.Cell,
};

export default Table;
