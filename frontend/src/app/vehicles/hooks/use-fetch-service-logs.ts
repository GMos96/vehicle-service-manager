import { useLoading } from "@/hooks/useLoading";
import { useEffect } from "react";
import { getServiceLogs } from "@/app/vehicles/actions/service-log.actions";
import { ServiceLogDTO } from "@/app/vehicles/types";

export const useFetchServiceLogs = (vehicleId: number) => {
  const loadingHook = useLoading<ServiceLogDTO[]>(
    () => getServiceLogs(vehicleId),
    [],
  );

  useEffect(() => {
    loadingHook.refresh();
  }, [vehicleId]);

  return loadingHook;
};
