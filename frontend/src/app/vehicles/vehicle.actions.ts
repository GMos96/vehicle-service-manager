import { api, handleValidationError } from "@/core/api";
import {
  CreateVehicleDTO,
  UpdateVehicleDTO,
  VehicleDTO,
} from "@/app/vehicles/types";
import { AxiosResponse } from "axios";

export async function getVehicleList(): Promise<VehicleDTO[]> {
  return api.get("vehicle").then((response: AxiosResponse) => response.data);
}

export async function createVehicle(
  vehicle: CreateVehicleDTO,
): Promise<number> {
  return api
    .post("vehicle", vehicle)
    .then((response) => response.data, handleValidationError);
}

export async function updateVehicle(
  vehicle: UpdateVehicleDTO,
): Promise<VehicleDTO> {
  const vehicleId = vehicle.id;
  return api
    .put(`vehicle/${vehicleId}`, vehicle)
    .then(() => getVehicle(vehicleId));
}

export async function getVehicle(vehicleId?: number): Promise<VehicleDTO> {
  return api.get(`vehicle/${vehicleId}`).then((response) => response.data);
}
