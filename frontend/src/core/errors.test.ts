import { describe, it, expect, vi } from "vitest";
import { AxiosError } from "axios";
import { getErrorMessage, showErrorToast, showSuccessToast } from "./errors";

vi.mock("@/components/ui/toaster", () => ({
  toaster: { create: vi.fn() },
}));

import { toaster } from "@/components/ui/toaster";

function makeAxiosError(options: {
  data?: unknown;
  hasResponse?: boolean;
  message?: string;
}): AxiosError {
  const error = new AxiosError(options.message ?? "Request failed");
  if (options.hasResponse ?? true) {
    error.response = {
      data: options.data,
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: {} as any,
    };
  }
  return error;
}

describe("getErrorMessage", () => {
  it("returns response.data.message for an AxiosError with a string message", () => {
    const error = makeAxiosError({ data: { message: "Invalid credentials" } });
    expect(getErrorMessage(error)).toBe("Invalid credentials");
  });

  it("returns a network-specific fallback for an AxiosError with no response", () => {
    const error = makeAxiosError({ hasResponse: false });
    expect(getErrorMessage(error)).toBe(
      "Network error. Please check your connection.",
    );
  });

  it("falls back to error.message when the response has no message field", () => {
    const error = makeAxiosError({
      data: { other: "field" },
      message: "Request failed with status code 500",
    });
    expect(getErrorMessage(error)).toBe("Request failed with status code 500");
  });

  it("returns the message of a plain Error", () => {
    expect(getErrorMessage(new Error("boom"))).toBe("boom");
  });

  it("returns a plain string error as-is", () => {
    expect(getErrorMessage("plain string error")).toBe("plain string error");
  });

  it("returns a generic fallback for unknown error shapes", () => {
    expect(getErrorMessage(undefined)).toBe(
      "Something went wrong. Please try again.",
    );
    expect(getErrorMessage({ some: "object" })).toBe(
      "Something went wrong. Please try again.",
    );
  });
});

describe("showErrorToast", () => {
  it("creates an error toast with the resolved message and title", () => {
    showErrorToast("boom", { title: "Custom title" });

    expect(toaster.create).toHaveBeenCalledWith({
      type: "error",
      title: "Custom title",
      description: "boom",
    });
  });

  it("defaults to a generic title when none is provided", () => {
    showErrorToast("boom");

    expect(toaster.create).toHaveBeenCalledWith({
      type: "error",
      title: "Error",
      description: "boom",
    });
  });
});

describe("showSuccessToast", () => {
  it("creates a success toast with the given description and title", () => {
    showSuccessToast("Vehicle created", "Success");

    expect(toaster.create).toHaveBeenCalledWith({
      type: "success",
      title: "Success",
      description: "Vehicle created",
    });
  });
});
