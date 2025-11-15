import { api, handleValidationError } from "@/core/api";
import {
  CreateVehicleDTO,
  UpdateVehicleDTO,
  VehicleDTO,
} from "@/app/vehicles/types";
import { AxiosResponse } from "axios";
import { OilType, OilTypeDescription } from "@/types/vehicles";

export async function getVehicleList(): Promise<VehicleDTO[]> {
  return api.get("vehicles").then((response: AxiosResponse) => response.data);
}

export async function createVehicle(
  vehicle: CreateVehicleDTO,
): Promise<number> {
  return api
    .post("vehicles", vehicle)
    .then((response) => response.data, handleValidationError);
}

export async function updateVehicle(
  vehicle: UpdateVehicleDTO,
): Promise<VehicleDTO> {
  const vehicleId = vehicle.id;
  return api
    .put(`vehicles/${vehicleId}`, vehicle)
    .then(() => getVehicle(vehicleId));
}

export async function getVehicle(vehicleId?: number): Promise<VehicleDTO> {
  return api.get(`vehicles/${vehicleId}`).then((response) => response.data);
}

export async function getOilTypes(): Promise<
  {
    value: OilType;
    label: OilTypeDescription;
  }[]
> {
  const response = await api.get(`vehicles/oil/types`);
  return response.data;
}
