import { useLoading } from "@/hooks/useLoading";
import { getServiceLogTypes } from "@/app/vehicles/actions/service-log.actions";
import { useEffect } from "react";

export const useFetchServiceLogTypes = () => {
  const loadingHook = useLoading(getServiceLogTypes, []);

  useEffect(() => {
    loadingHook.refresh();
  }, []);

  return loadingHook;
};
