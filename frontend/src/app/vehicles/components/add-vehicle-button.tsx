import AddVehicleForm from "@/app/vehicles/components/add-vehicle-form";
import { BiPlus } from "react-icons/bi";
import { DialogButton } from "@/components/ui/dialog-button";

type Props = { onClose: () => void };
export default function AddVehicleButton({ onClose }: Props) {
  function close() {
    onClose();
  }

  return (
    <DialogButton.Root>
      <DialogButton.Button id="addVehicleButton">
        <BiPlus />
        Add Vehicle
      </DialogButton.Button>
      <DialogButton.Dialog title="Add Vehicle">
        <AddVehicleForm onSuccess={close} />
      </DialogButton.Dialog>
    </DialogButton.Root>
  );
}
