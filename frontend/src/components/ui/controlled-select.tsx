"use client";

import { Control, Controller } from "react-hook-form";
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

type Props = {
  data: ControlledSelectItem[];
  control: Control<any, any>;
  name: string;
  placeholder?: string;
};
export const ControlledSelect = ({
  data,
  control,
  name,
  placeholder = "",
}: Props) => {
  const collection = createListCollection({
    items: data,
  });

  const portalRef = useContext(ContainerRefContext);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <SelectRoot
          collection={collection}
          name={field.name}
          value={field.value}
          onValueChange={({ value }) => field.onChange(value)}
          onInteractOutside={() => field.onBlur()}
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
