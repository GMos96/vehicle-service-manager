import { api, handleValidationError } from "@/core/api";
import {
  CreateVehicleDTO,
  DecodedVinDTO,
  RecallDTO,
  UpdateVehicleDTO,
  VehicleAnalyticsDTO,
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

export async function decodeVin(vin: string): Promise<DecodedVinDTO> {
  return api
    .get("vehicles/vin-decode", { params: { vin } })
    .then((response) => response.data);
}

export async function getVehicleRecalls(
  vehicleId: number,
): Promise<RecallDTO[]> {
  return api
    .get(`vehicles/${vehicleId}/recalls`)
    .then((response) => response.data);
}

export async function getVehicleAnalytics(
  vehicleId: number,
): Promise<VehicleAnalyticsDTO> {
  return api
    .get(`vehicles/${vehicleId}/analytics`)
    .then((response) => response.data);
}
