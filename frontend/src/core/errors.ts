import axios from "axios";
import { toaster } from "@/components/ui/toaster";

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";
const NETWORK_MESSAGE = "Network error. Please check your connection.";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string") {
      return message;
    }
    if (!error.response) {
      return NETWORK_MESSAGE;
    }
    return error.message || FALLBACK_MESSAGE;
  }

  if (error instanceof Error) {
    return error.message || FALLBACK_MESSAGE;
  }

  if (typeof error === "string") {
    return error;
  }

  return FALLBACK_MESSAGE;
}

export function showErrorToast(error: unknown, opts?: { title?: string }) {
  toaster.create({
    type: "error",
    title: opts?.title ?? "Error",
    description: getErrorMessage(error),
  });
}

export function showSuccessToast(description: string, title?: string) {
  toaster.create({
    type: "success",
    title,
    description,
  });
}
