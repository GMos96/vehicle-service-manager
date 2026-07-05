import { useLoading } from "@/hooks/useLoading";
import { useCallback, useEffect } from "react";
import { getVehicleRecalls } from "@/app/vehicles/vehicle.actions";
import { RecallDTO } from "@/app/vehicles/types";

export const useFetchRecalls = (vehicleId: number) => {
  const callback = useCallback(() => getVehicleRecalls(vehicleId), [vehicleId]);
  const loadingHook = useLoading<RecallDTO[]>(callback, []);

  useEffect(() => {
    loadingHook.refresh();
  }, [vehicleId]);

  return loadingHook;
};
