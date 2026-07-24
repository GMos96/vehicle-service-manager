import { FieldErrors } from "react-hook-form";
import { ValidationErrors } from "@/types/validation-error";

export function fieldErrorsToValidationErrors(
  fieldErrors: FieldErrors,
): ValidationErrors {
  return Object.entries(fieldErrors)
    .filter(([, error]) => !!error)
    .map(([property, error]) => ({
      property,
      message: (error?.message as string) || "This field is required",
    }));
}
