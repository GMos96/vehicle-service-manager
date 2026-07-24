import { useEffect } from "react";
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
import { ServiceLogDescription } from "@/types/service-logs";
import ReceiptScanner from "@/app/vehicles/components/receipt-scanner";
import { type ParsedReceipt } from "@/app/vehicles/receipt-parse";

type Props = {
  vehicleId: number;
  onSave: () => void;
};

export const AddServiceLogForm = ({ vehicleId, onSave }: Props) => {
  const { register, handleSubmit, control, watch, setValue, formState } =
    useForm<CreateServiceLogDTO>();
  const { data } = useFetchServiceLogTypes();
  const serviceType = watch("serviceType");

  useEffect(() => {
    const type = Array.isArray(serviceType) ? serviceType[0] : serviceType;
    const defaultDescription =
      type && ServiceLogDescription[type as keyof typeof ServiceLogDescription];

    if (defaultDescription && !formState.dirtyFields.description) {
      setValue("description", defaultDescription);
    }
  }, [serviceType]);

  function handleExtract(fields: ParsedReceipt) {
    if (fields.serviceDate) setValue("serviceDate", fields.serviceDate as any);
    if (fields.mileage !== undefined) setValue("mileage", fields.mileage);
    if (fields.repairCost !== undefined) setValue("repairCost", fields.repairCost);
    if (fields.serviceType) setValue("serviceType", fields.serviceType as any);
  }

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
        <ReceiptScanner onExtract={handleExtract} />
        <HStack>
          <Field label="Mileage at Service">
            <Input
              type="number"
              {...register("mileage", { valueAsNumber: true })}
              data-testid="serviceLogMileage"
            ></Input>
          </Field>
          <Field label="Service Date">
            <Input
              type="date"
              {...register("serviceDate")}
              data-testid="serviceDate"
            ></Input>
          </Field>
        </HStack>
        <Field label="Service Type">
          <ControlledSelect
            data={data}
            control={control}
            placeholder="Select a Type"
            name="serviceType"
            data-testid="serviceType"
          />
        </Field>
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
          <DialogButton.ActionButton
            type="submit"
            loading={formState.isSubmitting}
            data-testid="addServiceLogSubmitButton"
          >
            Add Service Log
          </DialogButton.ActionButton>
          <DialogCancelButton />
        </HStack>
      </Stack>
    </form>
  );
};
