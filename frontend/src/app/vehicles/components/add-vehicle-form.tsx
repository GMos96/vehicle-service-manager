import { Field } from "@/components/ui/field";
import { HStack, Input } from "@chakra-ui/react";
import { CreateVehicleDTO } from "@/app/vehicles/types";
import { Button } from "@/components/ui/button";
import { createVehicle } from "@/app/vehicles/vehicle.actions";
import { DialogCancelButton } from "@/components/ui/dialog";
import { ValidationError, ValidationErrors } from "@/types/validation-error";
import { useForm } from "react-hook-form";
import { useState } from "react";

type Props = {
  onSuccess: (vehicleId: number) => void;
};

export default function AddVehicleForm({ onSuccess }: Props) {
  const { register, handleSubmit } = useForm<CreateVehicleDTO>();
  const [errors, setErrors] = useState<ValidationErrors>();

  const onSubmit = handleSubmit((data) => {
    createVehicle(data).then(
      (newVehicleId) => {
        onSuccess(newVehicleId);
      },
      (errors: ValidationError[]) => {
        setErrors(errors);
      },
    );
  });

  return (
    <form className="vsm-form" onSubmit={onSubmit}>
      <Field label="Year" field="year" width={200} errors={errors}>
        <Input {...register("year")}></Input>
      </Field>
      <HStack align="start">
        <Field label="Make" field="make" errors={errors}>
          <Input {...register("make")}></Input>
        </Field>
        <Field label="Model" field="model" errors={errors}>
          <Input {...register("model")}></Input>
        </Field>
        <Field label="Trim" width={200} field="trim" errors={errors}>
          <Input {...register("trim")}></Input>
        </Field>
      </HStack>
      <HStack>
        <Field label="Mileage" field="mileage" errors={errors}>
          <Input
            type="number"
            {...register("mileage", { valueAsNumber: true })}
          ></Input>
        </Field>
      </HStack>

      <HStack justify="end">
        <Button type="submit">Add Vehicle</Button>
        <DialogCancelButton />
      </HStack>
    </form>
  );
}
