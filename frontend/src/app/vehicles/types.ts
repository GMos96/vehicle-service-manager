import { ServiceLogType } from "@/types/service-logs";

export interface VehicleDTO {
  id: number;
  year: number;
  make: string;
  model: string;
  trim: string;
  mileage: number;
  lastUpdatedDate?: Date;
  oil?: Partial<OilDTO>;
  oilFilter?: Partial<OilFilterDTO>;
  tire?: Partial<TireDTO>;
}

export type CreateVehicleDTO = Partial<VehicleDTO>;
export type UpdateVehicleDTO = Partial<VehicleDTO>;

export interface OilDTO {
  id: number;
  brand: string;
  weight: string;
  type: "standard" | "synthetic";
  vehicleId: string;
}

export interface OilFilterDTO {
  id: number;
  brand: string;
  model: string;
  vehicleId: string;
}

export interface TireDTO {
  id: number;
  brand: string;
  size: string;
  vehicleId: string;
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
