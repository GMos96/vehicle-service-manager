import { describe, it, expect, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useLoading } from "./useLoading";

vi.mock("@/components/ui/toaster", () => ({
  toaster: { create: vi.fn() },
}));

import { toaster } from "@/components/ui/toaster";

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

  it("on rejection, sets loading=false, stores the error, and shows an error toast", async () => {
    const err = new Error("fetch failed");
    const fetchFn = vi.fn().mockRejectedValue(err);
    const { result } = renderHook(() => useLoading(fetchFn, []));

    act(() => {
      result.current.refresh();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(err);
    expect(toaster.create).toHaveBeenCalledTimes(1);
    expect(toaster.create).toHaveBeenCalledWith(
      expect.objectContaining({ type: "error", description: "fetch failed" }),
    );
  });
});
