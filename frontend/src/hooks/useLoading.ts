import { useState } from "react";

export function useLoading<T = any>(
  fetchFunction: () => Promise<T>,
  initialValue: T,
) {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<T>(initialValue);

  function refresh() {
    setLoading(true);
    fetchFunction().then((data) => {
      setLoading(false);
      setData(data);
    });
  }

  return {
    loading,
    data,
    refresh,
  };
}
