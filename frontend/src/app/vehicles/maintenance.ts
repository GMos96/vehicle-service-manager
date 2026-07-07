import dayjs, { Dayjs } from "dayjs";
import { ServiceLogType } from "@/types/service-logs";

export type MaintenanceStatus = "overdue" | "due_soon" | "ok" | "unknown";
export type MaintenanceKind = "oil_change" | "tire_rotation";

export interface MaintenanceItemDTO {
  kind: MaintenanceKind;
  dueMileage?: number;
  dueDate?: string;
  status: MaintenanceStatus;
  label: string;
}

type MaintenanceVehicle = {
  mileage?: number | null;
  oil?: { type?: string } | null;
};

type MaintenanceLog = {
  serviceType: ServiceLogType;
  serviceDate: Date | string;
  mileage?: number | null;
};

const OIL_KINDS = [ServiceLogType.OIL_CHANGE, ServiceLogType.OIL_CHANGE_ROTATION];
const TIRE_KINDS = [ServiceLogType.TIRE_ROTATION, ServiceLogType.OIL_CHANGE_ROTATION];

function latestLog(
  logs: MaintenanceLog[],
  types: ServiceLogType[],
): MaintenanceLog | undefined {
  return logs
    .filter((l) => types.includes(l.serviceType))
    .sort(
      (a, b) => dayjs(b.serviceDate).valueOf() - dayjs(a.serviceDate).valueOf(),
    )[0];
}

function decideStatus(
  currentMileage: number | undefined | null,
  dueMileage: number | undefined,
  dueDate: Dayjs | undefined,
  today: Dayjs,
): MaintenanceStatus {
  const mi = typeof currentMileage === "number" ? currentMileage : undefined;

  const mileageOverdue = mi !== undefined && dueMileage !== undefined && mi >= dueMileage;
  const dateOverdue = dueDate !== undefined && !today.isBefore(dueDate);

  if (mileageOverdue || dateOverdue) return "overdue";

  const milesLeft =
    mi !== undefined && dueMileage !== undefined ? dueMileage - mi : undefined;
  const daysLeft =
    dueDate !== undefined ? dueDate.diff(today, "day") : undefined;

  const dueSoonByMileage = milesLeft !== undefined && milesLeft <= 500;
  const dueSoonByDate = daysLeft !== undefined && daysLeft <= 30;

  if (dueSoonByMileage || dueSoonByDate) return "due_soon";

  if (dueMileage !== undefined || dueDate !== undefined) return "ok";

  return "unknown";
}

export function computeMaintenanceItems(
  vehicle: MaintenanceVehicle,
  logs: MaintenanceLog[],
  today: Dayjs = dayjs(),
): MaintenanceItemDTO[] {
  const isSynthetic = vehicle.oil?.type === "SYNTHETIC";
  const oilMiInterval = isSynthetic ? 5000 : 3000;
  const oilMonthInterval = isSynthetic ? 6 : 3;
  const tireMiInterval = 6000;
  const tireMonthInterval = 6;

  const currentMi =
    typeof vehicle.mileage === "number" ? vehicle.mileage : undefined;

  const lastOil = latestLog(logs, OIL_KINDS);
  const lastTire = latestLog(logs, TIRE_KINDS);

  let oilDueMileage: number | undefined;
  let oilDueDate: Dayjs | undefined;

  if (lastOil) {
    if (typeof lastOil.mileage === "number") {
      oilDueMileage = lastOil.mileage + oilMiInterval;
    }
    oilDueDate = dayjs(lastOil.serviceDate).add(oilMonthInterval, "month");
  } else if (currentMi !== undefined) {
    oilDueMileage = currentMi + oilMiInterval;
  }

  let tireDueMileage: number | undefined;
  let tireDueDate: Dayjs | undefined;

  if (lastTire) {
    if (typeof lastTire.mileage === "number") {
      tireDueMileage = lastTire.mileage + tireMiInterval;
    }
    tireDueDate = dayjs(lastTire.serviceDate).add(tireMonthInterval, "month");
  } else if (currentMi !== undefined) {
    tireDueMileage = currentMi + tireMiInterval;
  }

  return [
    {
      kind: "oil_change",
      dueMileage: oilDueMileage,
      dueDate: oilDueDate?.format("YYYY-MM-DD"),
      status: decideStatus(currentMi, oilDueMileage, oilDueDate, today),
      label: isSynthetic ? "Oil Change (Synthetic)" : "Oil Change",
    },
    {
      kind: "tire_rotation",
      dueMileage: tireDueMileage,
      dueDate: tireDueDate?.format("YYYY-MM-DD"),
      status: decideStatus(currentMi, tireDueMileage, tireDueDate, today),
      label: "Tire Rotation",
    },
  ];
}

export function worstStatus(items: MaintenanceItemDTO[]): MaintenanceStatus {
  const priority: MaintenanceStatus[] = [
    "overdue",
    "due_soon",
    "ok",
    "unknown",
  ];
  for (const s of priority) {
    if (items.some((i) => i.status === s)) return s;
  }
  return "unknown";
}
