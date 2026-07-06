import { useLoading } from "@/hooks/useLoading";
import { useCallback, useEffect } from "react";
import { getVehicleAnalytics } from "@/app/vehicles/vehicle.actions";
import { VehicleAnalyticsDTO } from "@/app/vehicles/types";

export const useFetchAnalytics = (vehicleId: number) => {
  const callback = useCallback(
    () => getVehicleAnalytics(vehicleId),
    [vehicleId],
  );
  const loadingHook = useLoading<VehicleAnalyticsDTO | undefined>(
    callback,
    undefined,
  );

  useEffect(() => {
    loadingHook.refresh();
  }, [vehicleId]);

  return loadingHook;
};
