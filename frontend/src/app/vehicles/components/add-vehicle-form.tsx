import { useForm } from "react-hook-form";
import { Field } from "@/components/ui/field";
import { HStack, Input } from "@chakra-ui/react";
import { CreateVehicleDTO } from "@/app/vehicles/types";
import { Button } from "@/components/ui/button";
import { createVehicle } from "@/app/vehicles/vehicle.actions";

type Props = {
  onSuccess: (vehicleId: number) => void;
};

export default function AddVehicleForm({ onSuccess }: Props) {
  const { register, handleSubmit } = useForm<CreateVehicleDTO>();
  const onSubmit = handleSubmit((data) => {
    createVehicle(data).then((newVehicleId) => {
      onSuccess(newVehicleId);
    });
  });

  return (
    <form className="vsm-form" onSubmit={onSubmit}>
      <Field label="Year" width={200}>
        <Input {...register("year")}></Input>
      </Field>
      <HStack>
        <Field label="Make">
          <Input {...register("make")}></Input>
        </Field>
        <Field label="Model">
          <Input {...register("model")}></Input>
        </Field>
        <Field label="Trim" width={200}>
          <Input {...register("trim")}></Input>
        </Field>
      </HStack>
      <HStack>
        <Field label="Mileage">
          <Input {...register("mileage")}></Input>
        </Field>
      </HStack>

      <HStack justify="end">
        <Button type="submit">Add Vehicle</Button>
        <Button onClick={() => onSuccess(0)}>Cancel</Button>
      </HStack>
    </form>
  );
}
