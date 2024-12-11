"use client";

import { VehicleDTO } from "@/app/vehicles/types";
import { useRouter } from "next/navigation";
import Table from "@/components/ui/table";
import { ReactNode } from "react";
import { getVehicleDisplayName } from "@/app/vehicles/util";

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

  return (
    <Table.Root
      interactive={enableClickToNavigate}
      loading={loading}
      data={vehicles}
      headerRow={Header}
    >
      {vehicles?.map((vehicle) => (
        <Table.Row
          key={vehicle.id}
          onClick={() =>
            enableClickToNavigate && router.push(`/vehicles/${vehicle.id}`)
          }
          cursor={enableClickToNavigate ? "pointer" : "default"}
        >
          <Table.Cell>{getVehicleDisplayName(vehicle)}</Table.Cell>
          <Table.Cell>{vehicle.mileage}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Root>
  );
}

const Header: ReactNode = (
  <Table.Row>
    <Table.ColumnHeader>Vehicle</Table.ColumnHeader>
    <Table.ColumnHeader>Mileage</Table.ColumnHeader>
  </Table.Row>
);
