export interface VehicleDTO {
  id: number;
  year: number;
  make: string;
  model: string;
  trim: string;
  mileage: number;
  lastUpdatedDate?: Date;
  oil?: OilDTO;
  oilFilter?: OilFilterDTO;
  tire?: TireDTO;
}

export type CreateVehicleDTO = Partial<VehicleDTO>;
export type UpdateVehicleDTO = Partial<VehicleDTO>;

export interface OilDTO {
  id: number;
  brand: string;
  weight: string;
  type: string;
  vehicleId: string;
}

export interface OilFilterDTO {
  id: string;
  brand: string;
  model: string;
  vehicleId: string;
}

export interface TireDTO {
  id: string;
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
  mileage?: number;
  serviceDate: Date;
  description: string;
  repairCost: number;
  serviceType: string[];
}
