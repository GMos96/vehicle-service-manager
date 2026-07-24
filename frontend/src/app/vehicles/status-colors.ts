import { MaintenanceStatus } from "@/app/vehicles/types";

export const STATUS_COLOR: Record<MaintenanceStatus, string> = {
  overdue: "red.500",
  due_soon: "orange.400",
  ok: "green.500",
  unknown: "fg.subtle",
};

export const STATUS_BG: Record<MaintenanceStatus, string> = {
  overdue: "red.subtle",
  due_soon: "orange.subtle",
  ok: "green.subtle",
  unknown: "bg.subtle",
};
