"use client";

import GaugePanel from "@/components/ui/gauge-panel";
import { useFetchMaintenance } from "@/app/vehicles/hooks/use-fetch-maintenance";
import { VehicleDTO } from "@/app/vehicles/types";
import { STATUS_BG, STATUS_COLOR } from "@/app/vehicles/status-colors";

const STATUS_TAG: Record<string, string> = {
  overdue: "Overdue",
  due_soon: "Due Soon",
  ok: "On Track",
  unknown: "Unknown",
};

export default function NextServiceGauge({ vehicle }: { vehicle: VehicleDTO }) {
  const { data, loading } = useFetchMaintenance(vehicle.id);
  const oilItem = data.find((item) => item.kind === "oil_change");

  if (
    loading ||
    !oilItem ||
    oilItem.dueMileage === undefined ||
    vehicle.mileage === undefined
  ) {
    return null;
  }

  const interval = vehicle.oil?.type === "SYNTHETIC" ? 5000 : 3000;
  const milesRemaining = Math.max(oilItem.dueMileage - vehicle.mileage, 0);
  const arcFill = Math.min(Math.max(1 - milesRemaining / interval, 0), 1);

  return (
    <GaugePanel
      title="Miles to Next Service"
      subtitle={oilItem.label}
      tag={STATUS_TAG[oilItem.status]}
      tagColor={STATUS_COLOR[oilItem.status]}
      tagBg={STATUS_BG[oilItem.status]}
      value={milesRemaining.toLocaleString()}
      unit="mi"
      footerLabel="Due at"
      footerValue={`${oilItem.dueMileage.toLocaleString()} mi`}
      arcFill={arcFill}
    />
  );
}
