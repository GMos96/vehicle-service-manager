import { VehicleDTO } from "@/app/vehicles/types";

export function getVehicleDisplayName(vehicle: VehicleDTO): string {
  return `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`;
}

export function calculateNextRecommendedServiceMileage(vehicle: VehicleDTO): number {
  const oilType = vehicle.oil?.type;
  const increment = oilType === "SYNTHETIC" ? 5000 : 3000;
  return vehicle.mileage + increment;
}
