import { useForm } from "react-hook-form";
import { CreateServiceLogDTO } from "@/app/vehicles/types";
import { createServiceLog } from "@/app/vehicles/actions/service-log.actions";
import { Field } from "@/components/ui/field";
import { HStack, Input, Stack, Textarea } from "@chakra-ui/react";
import { ControlledSelect } from "@/components/ui/controlled-select";
import { DialogCancelButton } from "@/components/ui/dialog";
import { DialogButton } from "@/components/ui/dialog-button";
import { useFetchServiceLogTypes } from "@/app/vehicles/hooks/use-fetch-service-log-types";
import { showErrorToast, showSuccessToast } from "@/core/errors";

type Props = {
  vehicleId: number;
  onSave: () => void;
};

export const AddServiceLogForm = ({ vehicleId, onSave }: Props) => {
  const { register, handleSubmit, control } = useForm<CreateServiceLogDTO>();
  const { data } = useFetchServiceLogTypes();

  const onSubmit = handleSubmit((data: CreateServiceLogDTO) => {
    createServiceLog(data, vehicleId).then(
      () => {
        showSuccessToast("Service log added");
        onSave();
      },
      (error) => showErrorToast(error, { title: "Could not add service log" }),
    );
  });

  return (
    <form onSubmit={onSubmit}>
      <Stack gap={4}>
        <HStack>
          <Field label="Mileage at Service">
            <Input
              type="number"
              {...register("mileage", { valueAsNumber: true })}
              data-testid="serviceLogMileage"
            ></Input>
          </Field>
          <Field label="Service Type">
            <ControlledSelect
              data={data}
              control={control}
              placeholder="Select a Type"
              name="serviceType"
              data-testid="serviceType"
            />
          </Field>
        </HStack>
        <Field label="Description">
          <Textarea {...register("description")} data-testid="description" />
        </Field>
        <Field label="Repair Cost ($)">
          <Input
            type="number"
            {...register("repairCost", { valueAsNumber: true })}
            data-testid="repairCost"
          ></Input>
        </Field>
        <HStack justify="end">
          <DialogButton.ActionButton type="submit" data-testid="addServiceLogSubmitButton">
            Add Service Log
          </DialogButton.ActionButton>
          <DialogCancelButton />
        </HStack>
      </Stack>
    </form>
  );
};
