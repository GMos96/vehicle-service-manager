"use client";

import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { useContext } from "react";
import { ContainerRefContext } from "@/core/context/container-ref.context";
import { createListCollection } from "@ark-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";

type ControlledSelectItem = { value: string; label: string };

type Props<T extends FieldValues> = {
  data: ControlledSelectItem[];
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  rules?: RegisterOptions<T, Path<T>>;
  "data-testid"?: string;
};
export const ControlledSelect = <T extends FieldValues>({
  data,
  control,
  name,
  placeholder = "",
  rules,
  "data-testid": testId,
}: Props<T>) => {
  const collection = createListCollection({
    items: data,
  });

  const portalRef = useContext(ContainerRefContext);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <SelectRoot
          collection={collection}
          name={field.name}
          value={field.value}
          onValueChange={({ value }) => field.onChange(value)}
          onInteractOutside={() => field.onBlur()}
          data-testid={testId}
        >
          <SelectTrigger>
            <SelectValueText placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent portalRef={portalRef}>
            {collection.items.map((item) => (
              <SelectItem item={item} key={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      )}
    />
  );
};
