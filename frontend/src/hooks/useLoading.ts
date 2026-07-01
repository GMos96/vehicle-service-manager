import { useState } from "react";
import { showErrorToast } from "@/core/errors";

export function useLoading<T = any>(
  fetchFunction: () => Promise<T>,
  initialValue: T,
) {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<T>(initialValue);
  const [error, setError] = useState<unknown>(undefined);

  function refresh() {
    setLoading(true);
    fetchFunction().then(
      (data) => {
        setLoading(false);
        setError(undefined);
        setData(data);
      },
      (err) => {
        setLoading(false);
        setError(err);
        showErrorToast(err);
      },
    );
  }

  return {
    loading,
    data,
    error,
    refresh,
  };
}
