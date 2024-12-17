import { Field as ChakraField } from "@chakra-ui/react";
import * as React from "react";
import { ValidationError, ValidationErrors } from "@/types/validation-error";

export interface FieldProps extends Omit<ChakraField.RootProps, "label"> {
  field?: string;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errors?: ValidationErrors;
  optionalText?: React.ReactNode;
}

function getApplicableErrors(
  errors?: ValidationErrors,
  field?: string,
): ValidationError[] | undefined {
  return errors?.filter((value) => value.property === field);
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  function Field(props, ref) {
    const {
      label,
      children,
      helperText,
      errors,
      field,
      optionalText,
      ...rest
    } = props;

    const applicableErrors = getApplicableErrors(errors, field);

    return (
      <ChakraField.Root
        ref={ref}
        invalid={!!applicableErrors?.length}
        {...rest}
      >
        {label && (
          <ChakraField.Label>
            {label}
            <ChakraField.RequiredIndicator fallback={optionalText} />
          </ChakraField.Label>
        )}
        {children}
        {helperText && (
          <ChakraField.HelperText>{helperText}</ChakraField.HelperText>
        )}
        {errors && (
          <ChakraField.ErrorText>
            {applicableErrors ? <>{applicableErrors[0]?.message}</> : ""}
          </ChakraField.ErrorText>
        )}
      </ChakraField.Root>
    );
  },
);
