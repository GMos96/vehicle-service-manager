import { TireDTO } from "@/app/vehicles/types";
import {
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
  DataListRoot,
  Group,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import EditableInput from "@/components/ui/editable-input";

type Props = {
  tire?: Partial<TireDTO>;
  onEdit: (partial: Partial<TireDTO>) => void;
};

export default function TireSection({ tire, onEdit }: Props) {
  return (
    <DataListRoot orientation="vertical">
      <Group grow>
        <TireListItem label="Tire Brand">
          <EditableInput
            onChange={(brand) => onEdit({ brand })}
            value={tire?.brand}
          ></EditableInput>
        </TireListItem>
        <TireListItem label="Tire Size">
          <EditableInput
            onChange={(size) => onEdit({ size })}
            value={tire?.size}
          ></EditableInput>
        </TireListItem>
      </Group>
    </DataListRoot>
  );
}

type TireListItemProps = {
  label: string;
  children: ReactNode;
};

function TireListItem({ label, children }: TireListItemProps) {
  return (
    <DataListItem>
      <DataListItemLabel>{label}</DataListItemLabel>
      <DataListItemValue>{children}</DataListItemValue>
    </DataListItem>
  );
}
