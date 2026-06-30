import { OilFilterDTO } from "@/app/vehicles/types";
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
  oilFilter?: Partial<OilFilterDTO>;
  onEdit: (partial: Partial<OilFilterDTO>) => void;
};
export default function OilFilterSection({ oilFilter, onEdit }: Props) {
  return (
    <DataListRoot orientation="vertical">
      <Group grow>
        <OilFilterListItem label="Oil Filter Brand">
          <EditableInput
            onChange={(brand) => onEdit({ brand })}
            value={oilFilter?.brand}
          ></EditableInput>
        </OilFilterListItem>
        <OilFilterListItem label="Oil Filter Model No.">
          <EditableInput
            onChange={(model) => onEdit({ model })}
            value={oilFilter?.model}
          />
        </OilFilterListItem>
      </Group>
    </DataListRoot>
  );
}

type OilFilterListItemProps = {
  label: string;
  children: ReactNode;
};

function OilFilterListItem({ label, children }: OilFilterListItemProps) {
  return (
    <DataListItem>
      <DataListItemLabel
        fontFamily="body"
        fontSize="xs"
        letterSpacing="0.08em"
        textTransform="uppercase"
        color="fg.subtle"
      >
        {label}
      </DataListItemLabel>
      <DataListItemValue>{children}</DataListItemValue>
    </DataListItem>
  );
}
