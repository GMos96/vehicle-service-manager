import Table from "@/components/ui/table";
import { Box } from "@chakra-ui/react";
import { useFetchRecalls } from "@/app/vehicles/hooks/use-fetch-recalls";
import { RecallDTO } from "@/app/vehicles/types";

export default function RecallsSection({ vehicleId }: { vehicleId: number }) {
  const { data, loading, error } = useFetchRecalls(vehicleId);

  if (error) {
    return (
      <Box color="fg.subtle" fontSize="sm">
        Unable to check recalls right now.
      </Box>
    );
  }

  return (
    <Table.Root
      loading={loading}
      headerRow={HeaderRow}
      data={data}
      customNoRecordsFound={
        <Box color="fg.subtle" fontSize="sm">
          No open recalls found for this vehicle.
        </Box>
      }
    >
      {data.map((recall: RecallDTO) => (
        <Table.Row key={recall.campaignNumber}>
          <Table.Cell fontFamily="mono" fontSize="sm" color="fg.muted">
            {recall.reportReceivedDate}
          </Table.Cell>
          <Table.Cell fontFamily="heading" fontWeight="500">
            {recall.component}
          </Table.Cell>
          <Table.Cell display={{ base: "none", sm: "table-cell" }}>
            {recall.summary}
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Root>
  );
}

const HeaderRow = (
  <Table.Row>
    <Table.Cell>Reported</Table.Cell>
    <Table.Cell>Component</Table.Cell>
    <Table.Cell display={{ base: "none", sm: "table-cell" }}>
      Summary
    </Table.Cell>
  </Table.Row>
);
