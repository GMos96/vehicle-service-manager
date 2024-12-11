import { api } from "@/core/api";
import { CreateServiceLogDTO, ServiceLogDTO } from "@/app/vehicles/types";

export async function getServiceLogs(
  vehicleId: number,
): Promise<ServiceLogDTO[]> {
  const response = await api.get(`serviceLog?vehicleId=${vehicleId}`);
  return response.data;
}

export async function createServiceLog(
  serviceLogDTO: CreateServiceLogDTO,
): Promise<void> {
  return api.post("serviceLog", {
    ...serviceLogDTO,
    serviceType: serviceLogDTO.serviceType[0],
  });
}
