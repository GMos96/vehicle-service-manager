import { useLoading } from "@/hooks/useLoading";
import { useCallback, useEffect } from "react";
import { getServiceLogs } from "@/app/vehicles/actions/service-log.actions";
import { ServiceLogDTO } from "@/app/vehicles/types";

export const useFetchServiceLogs = (vehicleId: number) => {
  const callback = useCallback(() => getServiceLogs(vehicleId), [vehicleId]);
  const loadingHook = useLoading<ServiceLogDTO[]>(callback, []);

  useEffect(() => {
    loadingHook.refresh();
  }, [vehicleId, loadingHook]);

  return loadingHook;
};
