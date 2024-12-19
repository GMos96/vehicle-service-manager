import { useForm } from "react-hook-form";
import { CreateServiceLogDTO } from "@/app/vehicles/types";
import { createServiceLog } from "@/app/vehicles/actions/service-log.actions";
import { Field } from "@/components/ui/field";
import { HStack, Input, Stack, Textarea } from "@chakra-ui/react";
import { ControlledSelect } from "@/components/ui/controlled-select";
import { DialogCancelButton } from "@/components/ui/dialog";
import { DialogButton } from "@/components/ui/dialog-button";
import { useFetchServiceLogTypes } from "@/app/vehicles/hooks/use-fetch-service-log-types";

type Props = {
  vehicleId: number;
  onSave: () => void;
};

export const AddServiceLogForm = ({ vehicleId, onSave }: Props) => {
  const { register, handleSubmit, control } = useForm<CreateServiceLogDTO>();
  const { data, loading } = useFetchServiceLogTypes();

  const onSubmit = handleSubmit((data: CreateServiceLogDTO) => {
    createServiceLog(data, vehicleId).then(() => {
      onSave();
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <Stack gap={4}>
        <HStack>
          <Field label="Mileage at Service">
            <Input
              type="number"
              {...register("mileage", { valueAsNumber: true })}
            ></Input>
          </Field>
          <Field label="Service Type">
            <ControlledSelect
              data={data}
              control={control}
              placeholder="Select a Type"
              name="serviceType"
            />
          </Field>
        </HStack>
        <Field label="Description">
          <Textarea {...register("description")} />
        </Field>
        <Field label="Repair Cost ($)">
          <Input
            type="number"
            {...register("repairCost", { valueAsNumber: true })}
          ></Input>
        </Field>
        <HStack justify="end">
          <DialogButton.ActionButton type="submit">
            Add Service Log
          </DialogButton.ActionButton>
          <DialogCancelButton />
        </HStack>
      </Stack>
    </form>
  );
};
