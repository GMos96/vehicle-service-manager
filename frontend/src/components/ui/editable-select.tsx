"use client";

import { HStack, IconButton, ListCollection, Select } from "@chakra-ui/react";
import { createListCollection } from "@ark-ui/react";
import { LuPencilLine } from "react-icons/lu";
import { useEffect, useState } from "react";

type Props = {
  value?: string;
  items: { label: string; value: string }[];
  triggerText: string;
  onChange: (type: string) => void;
};

const getComputedLabel = (
  collection: ListCollection,
  value?: string,
  defaultValue?: string,
): string => {
  return collection.find(value)?.label || defaultValue;
};

const EditableSelect = ({ value, items, triggerText, onChange }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const collection = createListCollection({
    items,
  });

  const [label, setLabel] = useState(
    getComputedLabel(collection, value, triggerText),
  );

  useEffect(() => {
    setLabel(getComputedLabel(collection, value, triggerText));
  }, [value, items]);

  const onSubmit = (value: string) => {
    setIsEditing(false);
    setLabel(getComputedLabel(collection, value, triggerText));
    onChange(value);
  };

  return (
    <>
      {isEditing ? (
        <Select.Root
          collection={collection}
          size="sm"
          onValueChange={({ value }) => {
            onSubmit(value[0]);
          }}
          value={[value ?? ""]}
          positioning={{ sameWidth: true, placement: "bottom" }}
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder={triggerText} />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Select.Positioner>
            <Select.Content width="full">
              {collection.items.map((item) => (
                <Select.Item item={item} key={item.value}>
                  {item.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      ) : (
        <HStack gap={2}>
          <span>{label}</span>
          <IconButton
            variant="ghost"
            aria-label="Edit Select"
            size="xs"
            onClick={() => setIsEditing(true)}
          >
            <LuPencilLine></LuPencilLine>
          </IconButton>
        </HStack>
      )}
    </>
  );
};

export default EditableSelect;
