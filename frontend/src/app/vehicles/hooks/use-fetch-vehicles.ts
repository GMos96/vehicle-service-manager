import { useLoading } from "@/hooks/useLoading";
import { getVehicleList } from "@/app/vehicles/vehicle.actions";
import { useEffect } from "react";

export const useFetchVehicles = () => {
  const loadingHook = useLoading(getVehicleList, []);

  useEffect(() => {
    loadingHook.refresh();
  }, [loadingHook]);

  return loadingHook;
};
