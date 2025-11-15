import { useLoading } from "@/hooks/useLoading";
import { useEffect } from "react";
import { getOilTypes } from "@/app/vehicles/vehicle.actions";

export const useFetchOilTypes = () => {
  const loadingHook = useLoading(getOilTypes, []);

  useEffect(() => {
    loadingHook.refresh();
  }, []);

  return loadingHook;
};
