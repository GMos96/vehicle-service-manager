export type ValidationResponse = {
  message: ValidationErrors;
  status: number;
};

export type ValidationError = {
  property: string;
  message: string;
};

export type ValidationErrors = ValidationError[];
