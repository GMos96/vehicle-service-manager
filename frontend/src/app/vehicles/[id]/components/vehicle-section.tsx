import {
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
  DataListRoot,
  Group,
} from "@chakra-ui/react";
import EditableInput from "@/components/ui/editable-input";
import { VehicleDTO } from "@/app/vehicles/types";
import { formatDate } from "@/util/date-util";

type Props = {
  vehicle: VehicleDTO;
  onEdit: (vehicle: Partial<VehicleDTO>) => void;
};

export default function VehicleSection({ vehicle, onEdit }: Props) {
  return (
    <DataListRoot orientation="vertical">
      <Group grow>
        <DataListItem>
          <DataListItemLabel
            fontFamily="body"
            fontSize="xs"
            letterSpacing="0.08em"
            textTransform="uppercase"
            color="fg.subtle"
          >
            Mileage of Last Service
          </DataListItemLabel>
          <DataListItemValue className="vsm-mono-num">
            <EditableInput
              value={vehicle?.mileage?.toString()}
              onChange={(mileage) => onEdit({ mileage: +mileage })}
            ></EditableInput>
          </DataListItemValue>
        </DataListItem>
        <DataListItem>
          <DataListItemLabel
            fontFamily="body"
            fontSize="xs"
            letterSpacing="0.08em"
            textTransform="uppercase"
            color="fg.subtle"
          >
            Date of Last Service
          </DataListItemLabel>
          <DataListItemValue className="vsm-mono-num">
            {formatDate(vehicle?.lastUpdatedDate)}
          </DataListItemValue>
        </DataListItem>
      </Group>
    </DataListRoot>
  );
}
