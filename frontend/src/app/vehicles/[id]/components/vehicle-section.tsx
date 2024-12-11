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
          <DataListItemLabel>Mileage of Last Service</DataListItemLabel>
          <DataListItemValue>
            <EditableInput
              value={vehicle?.mileage?.toString()}
              onChange={(mileage) => onEdit({ mileage: +mileage })}
            ></EditableInput>
          </DataListItemValue>
        </DataListItem>
        <DataListItem>
          <DataListItemLabel>Date of Last Service</DataListItemLabel>
          <DataListItemValue>
            {formatDate(vehicle?.lastUpdatedDate)}
          </DataListItemValue>
        </DataListItem>
      </Group>
    </DataListRoot>
  );
}
