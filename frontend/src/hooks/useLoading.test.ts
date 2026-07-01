import { describe, it, expect, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useLoading } from "./useLoading";

describe("useLoading", () => {
  it("initializes with loading=true and the provided initialValue", () => {
    const fetchFn = vi.fn().mockResolvedValue([]);
    const { result } = renderHook(() => useLoading(fetchFn, []));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
  });

  it("after refresh(), sets loading=false and updates data with the resolved value", async () => {
    const items = [{ id: 1 }, { id: 2 }];
    const fetchFn = vi.fn().mockResolvedValue(items);
    const { result } = renderHook(() => useLoading(fetchFn, []));

    act(() => {
      result.current.refresh();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(items);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("re-fetches and updates data on subsequent refresh() calls", async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(["first"])
      .mockResolvedValueOnce(["second"]);
    const { result } = renderHook(() => useLoading(fetchFn, []));

    act(() => {
      result.current.refresh();
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(["first"]);

    act(() => {
      result.current.refresh();
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(["second"]);
  });

  it("works with a null initialValue", () => {
    const fetchFn = vi.fn().mockResolvedValue("result");
    const { result } = renderHook(() => useLoading(fetchFn, null));

    expect(result.current.data).toBeNull();
  });
});
