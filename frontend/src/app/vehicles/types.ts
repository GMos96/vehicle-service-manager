export interface VehicleDTO {
  id: number;
  year: number;
  make: string;
  model: string;
  trim: string;
  mileage: number;
  lastUpdatedDate?: string;
  oil?: OilDTO;
}

export type CreateVehicleDTO = Partial<VehicleDTO>;
export type UpdateVehicleDTO = Partial<VehicleDTO>;

export interface OilDTO {
  id: number;
  brand: string;
  weight: string;
  type: string;
}
