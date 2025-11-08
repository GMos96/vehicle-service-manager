"use client";

import { Card, Container, Heading, HStack, Stack } from "@chakra-ui/react";
import VehicleList from "@/app/vehicles/components/vehicle-list";
import AddVehicleButton from "@/app/vehicles/components/add-vehicle-button";
import { useFetchVehicles } from "@/app/vehicles/hooks/use-fetch-vehicles";

export default function VehicleListPage() {
  const { data: vehicles, refresh, loading } = useFetchVehicles();

  return (
    <Container>
      <Stack gap={4}>
        <Heading as="h1" size="xl">
          My Garage
        </Heading>
        <Card.Root>
          <Card.Body gap={4}>
            <HStack justify="start" gap={4}>
              <AddVehicleButton onClose={() => refresh()} />
            </HStack>
            <VehicleList vehicles={vehicles} loading={loading}></VehicleList>
          </Card.Body>
        </Card.Root>
      </Stack>
    </Container>
  );
}
