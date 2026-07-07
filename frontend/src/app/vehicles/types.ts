import { ServiceLogType } from "@/types/service-logs";
import { OilType } from "@/types/vehicles";

export interface VehicleDTO {
  id: number;
  year: number;
  make: string;
  model: string;
  trim: string;
  mileage: number;
  vin?: string;
  lastUpdatedDate?: Date;
  nextRecommendedServiceMileage?: number;
  oil?: Partial<OilDTO>;
  oilFilter?: Partial<OilFilterDTO>;
  tire?: Partial<TireDTO>;
}

export interface DecodedVinDTO {
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  warning?: string;
}

export interface RecallDTO {
  campaignNumber: string;
  component: string;
  summary: string;
  consequence?: string;
  remedy?: string;
  reportReceivedDate: string;
}

export type MaintenanceStatus = "overdue" | "due_soon" | "ok" | "unknown";

export interface MaintenanceItemDTO {
  kind: "oil_change" | "tire_rotation";
  dueMileage?: number;
  dueDate?: string;
  status: MaintenanceStatus;
  label: string;
}

export interface SpendByServiceTypeDTO {
  serviceType: ServiceLogType;
  total: number;
  count: number;
}

export interface SpendByYearDTO {
  year: number;
  total: number;
}

export interface VehicleAnalyticsDTO {
  totalSpend: number;
  costPerMile: number | null;
  trackedMiles: number | null;
  byServiceType: SpendByServiceTypeDTO[];
  byYear: SpendByYearDTO[];
}

export type CreateVehicleDTO = Partial<VehicleDTO>;
export type UpdateVehicleDTO = Partial<VehicleDTO>;

export interface OilDTO {
  id: number;
  brand: string;
  weight: string;
  type: OilType;
  vehicleId: number;
}

export interface OilFilterDTO {
  id: number;
  brand: string;
  model: string;
  vehicleId: number;
}

export interface TireDTO {
  id: number;
  brand: string;
  size: string;
  vehicleId: number;
}

export interface ServiceLogDTO {
  id: number;
  mileage?: number;
  serviceDate: Date;
  description: string;
  repairCost: number;
  serviceType: string;
}

export interface CreateServiceLogDTO {
  id: number;
  mileage: number;
  serviceDate?: Date;
  description: string;
  repairCost?: number;
  serviceType: ServiceLogType;
}
