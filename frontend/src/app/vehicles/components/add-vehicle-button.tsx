import {
  DialogBody, DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AddVehicleForm from '@/app/vehicles/components/add-vehicle-form';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { BiPlus } from 'react-icons/bi';

type Props = { onClose: () => void }
export default function AddVehicleButton({ onClose }: Props) {
  const [open, setOpen] = useState<boolean>();

  function close() {
    setOpen(false);
    onClose();
  }

  return (
    <DialogRoot open={open}>
      <DialogTrigger asChild>
        <Button><BiPlus/>Add Vehicle</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Vehicle</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <AddVehicleForm onSuccess={close}></AddVehicleForm>
        </DialogBody>
        <DialogCloseTrigger/>
      </DialogContent>
    </DialogRoot>
  )
}