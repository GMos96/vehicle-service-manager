import { describe, it, expect } from "vitest";
import { AxiosError } from "axios";
import type { ValidationResponse } from "@/types/validation-error";
import { handleValidationError } from "./api";

function makeAxiosError(
  data?: Partial<ValidationResponse>,
): AxiosError<ValidationResponse> {
  const error = new AxiosError<ValidationResponse>("Request failed");
  if (data !== undefined) {
    error.response = {
      data: data as ValidationResponse,
      status: 422,
      statusText: "Unprocessable Entity",
      headers: {},
      config: {} as any,
    };
  }
  return error;
}

describe("handleValidationError", () => {
  it("rejects with data.message when the response contains a message array", async () => {
    const message = [{ property: "email", message: "Invalid email" }];
    const error = makeAxiosError({ message, status: 422 });

    await expect(handleValidationError(error)).rejects.toEqual(message);
  });

  it("rejects with the original error when response has no message field", async () => {
    const error = makeAxiosError({ status: 422 });

    await expect(handleValidationError(error)).rejects.toBe(error);
  });

  it("rejects with the original error when there is no response body", async () => {
    const error = makeAxiosError(undefined);

    await expect(handleValidationError(error)).rejects.toBe(error);
  });
});
