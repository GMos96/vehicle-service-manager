"use client";

import { VehicleDTO } from "@/app/vehicles/types";
import { useRouter } from "next/navigation";
import Table from "@/components/ui/table";
import { ReactNode } from "react";
import { getVehicleDisplayName } from "@/app/vehicles/util";
import { formatDate } from "@/util/date-util";

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
          <Table.Cell fontFamily="heading" fontWeight="500">
            {getVehicleDisplayName(vehicle)}
          </Table.Cell>
          <Table.Cell className="vsm-mono-num">
            {vehicle.mileage?.toLocaleString()} mi
          </Table.Cell>
          <Table.Cell fontFamily="mono" fontSize="sm" color="fg.muted">
            {formatDate(vehicle.lastUpdatedDate)}
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Root>
  );
}

const Header: ReactNode = (
  <Table.Row>
    <Table.ColumnHeader>Vehicle</Table.ColumnHeader>
    <Table.ColumnHeader>Mileage</Table.ColumnHeader>
    <Table.ColumnHeader>Date of Last Service</Table.ColumnHeader>
  </Table.Row>
);
