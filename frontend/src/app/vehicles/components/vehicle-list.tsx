"use client";

import { VehicleDTO } from "@/app/vehicles/types";
import { Box, Flex, Show, Spinner, Table, VStack } from "@chakra-ui/react";
import { LuBox } from "react-icons/lu";
import { useRouter } from "next/navigation";

type Props = { vehicles: VehicleDTO[]; loading: boolean };

export default function VehicleList({ vehicles, loading }: Props) {
  const router = useRouter();
  const noRecordsFound = (
    <VStack justify="center" textAlign="center" fontWeight="medium" h={300}>
      <LuBox></LuBox>
      <span>No Vehicles found</span>
    </VStack>
  );

  const fallback = (
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

  return (
    <Show when={vehicles?.length} fallback={fallback}>
      <Table.Root size="md" variant="outline" interactive>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Year</Table.ColumnHeader>
            <Table.ColumnHeader>Make</Table.ColumnHeader>
            <Table.ColumnHeader>Model</Table.ColumnHeader>
            <Table.ColumnHeader>Trim</Table.ColumnHeader>
            <Table.ColumnHeader>Mileage</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {vehicles?.map((vehicle) => (
            <Table.Row
              key={vehicle.id}
              onClick={() => router.push(`/vehicles/${vehicle.id}`)}
            >
              <Table.Cell>{vehicle.year}</Table.Cell>
              <Table.Cell>{vehicle.make}</Table.Cell>
              <Table.Cell>{vehicle.model}</Table.Cell>
              <Table.Cell>{vehicle.trim}</Table.Cell>
              <Table.Cell>{vehicle.mileage}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Show>
  );
}
