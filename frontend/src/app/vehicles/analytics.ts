import dayjs from "dayjs";
import { ServiceLogType } from "@/types/service-logs";

export interface SpendByServiceType {
  serviceType: ServiceLogType;
  total: number;
  count: number;
}

export interface SpendByYear {
  year: number;
  total: number;
}

export interface VehicleAnalyticsDTO {
  totalSpend: number;
  costPerMile: number | null;
  trackedMiles: number | null;
  byServiceType: SpendByServiceType[];
  byYear: SpendByYear[];
}

type AnalyticsServiceLog = {
  serviceType: ServiceLogType;
  repairCost: number;
  serviceDate: Date | string;
  mileage?: number;
};

export function computeVehicleAnalytics(
  vehicle: { mileage?: number },
  logs: AnalyticsServiceLog[],
): VehicleAnalyticsDTO {
  const totalSpend = logs.reduce((sum, log) => sum + (log.repairCost ?? 0), 0);

  const byServiceTypeMap = new Map<ServiceLogType, SpendByServiceType>();
  for (const log of logs) {
    const entry = byServiceTypeMap.get(log.serviceType) ?? {
      serviceType: log.serviceType,
      total: 0,
      count: 0,
    };
    entry.total += log.repairCost ?? 0;
    entry.count += 1;
    byServiceTypeMap.set(log.serviceType, entry);
  }

  const byYearMap = new Map<number, number>();
  for (const log of logs) {
    const year = dayjs(log.serviceDate).year();
    byYearMap.set(year, (byYearMap.get(year) ?? 0) + (log.repairCost ?? 0));
  }
  const byYear = Array.from(byYearMap.entries())
    .map(([year, total]) => ({ year, total }))
    .sort((a, b) => a.year - b.year);

  const loggedMileages = logs
    .map((log) => log.mileage)
    .filter((mileage): mileage is number => typeof mileage === "number");

  let costPerMile: number | null = null;
  let trackedMiles: number | null = null;
  if (loggedMileages.length > 0 && typeof vehicle.mileage === "number") {
    const minLoggedMileage = Math.min(...loggedMileages);
    const denominator = vehicle.mileage - minLoggedMileage;
    if (denominator > 0) {
      trackedMiles = denominator;
      costPerMile = totalSpend / denominator;
    }
  }

  return {
    totalSpend,
    costPerMile,
    trackedMiles,
    byServiceType: Array.from(byServiceTypeMap.values()),
    byYear,
  };
}
