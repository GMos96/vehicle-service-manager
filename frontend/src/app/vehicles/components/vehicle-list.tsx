"use client";

import { VehicleDTO } from "@/app/vehicles/types";
import { useRouter } from "next/navigation";
import VehicleCard from "@/app/vehicles/components/vehicle-card";
import { Grid, Center, Spinner } from "@chakra-ui/react";
import EmptyState from "@/components/ui/empty-state";

type Props = {
  vehicles: VehicleDTO[];
  loading: boolean;
  enableClickToNavigate?: boolean;
};

export default function VehicleList({
  vehicles,
  loading,
  enableClickToNavigate = true,
}: Props) {
  const router = useRouter();

  if (loading) {
    return (
      <Center py={20}>
        <Spinner color="accent.solidColor" />
      </Center>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return <EmptyState message="No vehicles yet. Add one to get started." />;
  }

  return (
    <Grid
      templateColumns={{
        base: "1fr",
        md: "repeat(2, 1fr)",
        lg: "repeat(3, 1fr)",
        xl: "repeat(4, 1fr)",
      }}
      gap={4}
    >
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onClick={
            enableClickToNavigate
              ? () => router.push(`/vehicles/${vehicle.id}`)
              : undefined
          }
        />
      ))}
    </Grid>
  );
}
