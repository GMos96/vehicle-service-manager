import { OilDTO } from '@/app/vehicles/types';
import { DataListItem, DataListItemLabel, DataListItemValue, DataListRoot, Group } from '@chakra-ui/react';
import EditableInput from '@/components/ui/editable-input';
import { ReactNode } from 'react';

type Props = { oil?: OilDTO, onEdit: (vehicleEdit: Partial<OilDTO>) => void };
export default function OilSection({ oil, onEdit }: Props) {
  return (
    <DataListRoot orientation="vertical">
      <Group grow>
        <OilListItem label="Brand">
          <EditableInput onChange={(brand) => onEdit({ brand })}
                         value={oil?.brand}>
          </EditableInput>
        </OilListItem>
        <OilListItem label="Weight">
          <EditableInput onChange={(weight) => onEdit({ weight })}
                         value={oil?.weight}>
          </EditableInput>
        </OilListItem>
      </Group>
      <OilListItem label="Type">
        { oil?.type }
      </OilListItem>
    </DataListRoot>
  )
}

type OilListItemProps = { children: ReactNode; label: string };
function OilListItem({ label, children }: OilListItemProps) {
  return (
    <DataListItem>
      <DataListItemLabel>{label}</DataListItemLabel>
      <DataListItemValue>
        { children }
      </DataListItemValue>
    </DataListItem>
  )
}