import { ValidationError } from "class-validator";

export function mapValidationErrors(errors: ValidationError[]) {
  return errors.map((error) => ({
    property: error.property,
    message:
      Object.values(error.constraints ?? {}).join(", ") || "Invalid value",
  }));
}
