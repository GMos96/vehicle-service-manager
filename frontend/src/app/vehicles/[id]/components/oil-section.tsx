import { OilDTO } from "@/app/vehicles/types";
import {
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
  DataListRoot,
  Group,
} from "@chakra-ui/react";
import EditableInput from "@/components/ui/editable-input";
import { ReactNode } from "react";
import EditableSelect from "@/components/ui/editable-select";
import { useFetchOilTypes } from "@/app/vehicles/hooks/use-fetch-oil-types";
import { OilType } from "@/types/vehicles";

type Props = {
  oil?: Partial<OilDTO>;
  onEdit: (vehicleEdit: Partial<OilDTO>) => void;
};
export default function OilSection({ oil, onEdit }: Props) {
  const { data } = useFetchOilTypes();

  return (
    <DataListRoot orientation="vertical">
      <Group grow>
        <OilListItem label="Oil Brand">
          <EditableInput
            onChange={(brand) => onEdit({ brand })}
            value={oil?.brand}
          ></EditableInput>
        </OilListItem>
        <OilListItem label="Oil Weight">
          <EditableInput
            onChange={(weight) => onEdit({ weight })}
            value={oil?.weight}
          ></EditableInput>
        </OilListItem>
      </Group>
      <OilListItem label="Oil Type">
        <EditableSelect
          value={oil?.type}
          items={data}
          triggerText="Select an Oil Type"
          onChange={(type) =>
            onEdit({
              type: type as OilType,
            })
          }
        ></EditableSelect>
      </OilListItem>
    </DataListRoot>
  );
}

type OilListItemProps = { children: ReactNode; label: string };
function OilListItem({ label, children }: OilListItemProps) {
  return (
    <DataListItem>
      <DataListItemLabel>{label}</DataListItemLabel>
      <DataListItemValue>{children}</DataListItemValue>
    </DataListItem>
  );
}
