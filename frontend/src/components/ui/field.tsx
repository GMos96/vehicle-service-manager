import { Field as ChakraField } from "@chakra-ui/react";
import * as React from "react";
import { useEffect, useState } from "react";

export interface FieldProps extends Omit<ChakraField.RootProps, "label"> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errors?: string[];
  optionalText?: React.ReactNode;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  function Field(props, ref) {
    const { label, children, helperText, errors, optionalText, ...rest } =
      props;

    const [invalid, setInvalid] = useState(false);
    useEffect(() => {
      setInvalid(!!errors);
    }, [errors]);

    return (
      <ChakraField.Root ref={ref} invalid={invalid} {...rest}>
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
            {errors ? `${label} ${errors[0]}` : ""}
          </ChakraField.ErrorText>
        )}
      </ChakraField.Root>
    );
  },
);
