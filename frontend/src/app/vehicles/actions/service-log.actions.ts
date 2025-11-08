import { api } from "@/core/api";
import { CreateServiceLogDTO, ServiceLogDTO } from "@/app/vehicles/types";

export async function getServiceLogs(
  vehicleId: number,
): Promise<ServiceLogDTO[]> {
  const response = await api.get(`service-logs?vehicleId=${vehicleId}`);
  return response.data;
}

export async function createServiceLog(
  serviceLogDTO: CreateServiceLogDTO,
  vehicleId: number,
): Promise<void> {
  return api.post("service-logs", {
    ...serviceLogDTO,
    vehicleId,
    serviceType: serviceLogDTO.serviceType[0],
  });
}

export async function getServiceLogTypes() {
  const response = await api.get(`service-logs/types`);
  return response.data;
}
