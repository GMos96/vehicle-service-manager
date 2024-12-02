"use client";

import { Container, HStack, Stack } from "@chakra-ui/react";
import VehicleList from "@/app/vehicles/components/vehicle-list";
import AddVehicleButton from "@/app/vehicles/components/add-vehicle-button";
import { useEffect, useState } from "react";
import { VehicleDTO } from "@/app/vehicles/types";
import { getVehicleList } from "@/app/vehicles/vehicle.actions";

export default function VehicleListPage() {
  const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  function updateVehicleList() {
    setLoading(true);
    getVehicleList().then((vehicles) => {
      setVehicles(vehicles);
      setLoading(false);
    });
  }

  useEffect(() => {
    updateVehicleList();
  }, []);

  return (
    <Container>
      <Stack gap={4}>
        <HStack justify="start" gap={4}>
          <AddVehicleButton onClose={updateVehicleList} />
        </HStack>
        <VehicleList vehicles={vehicles} loading={loading}></VehicleList>
      </Stack>
    </Container>
  );
}
