import { useLoading } from "@/hooks/useLoading";
import { useCallback, useEffect } from "react";
import { getVehicleMaintenanceItems } from "@/app/vehicles/vehicle.actions";
import { MaintenanceItemDTO } from "@/app/vehicles/types";

export const useFetchMaintenance = (vehicleId: number) => {
  const callback = useCallback(
    () => getVehicleMaintenanceItems(vehicleId),
    [vehicleId],
  );
  const loadingHook = useLoading<MaintenanceItemDTO[]>(callback, []);

  useEffect(() => {
    loadingHook.refresh();
  }, [vehicleId]);

  return loadingHook;
};
