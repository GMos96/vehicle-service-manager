import { useForm } from "react-hook-form";
import { CreateServiceLogDTO } from "@/app/vehicles/types";
import { createServiceLog } from "@/app/vehicles/service-log.actions";
import { Field } from "@/components/ui/field";
import { HStack, Input, Stack, Textarea } from "@chakra-ui/react";
import { ControlledSelect } from "@/components/ui/controlled-select";
import { Button } from "@/components/ui/button";
import { DialogCancelButton } from "@/components/ui/dialog";

export const AddServiceLogForm = ({}) => {
  const { register, handleSubmit, control } = useForm<CreateServiceLogDTO>();

  const data = [
    { value: "OIL_CHANGE", label: "Oil Change" },
    { value: "OTHER", label: "Other" },
  ];

  const onSubmit = handleSubmit((data: CreateServiceLogDTO) => {
    createServiceLog(data).then(() => {});
  });

  return (
    <form onSubmit={onSubmit}>
      <Stack gap={4}>
        <HStack>
          <Field label="Mileage at Service">
            <Input type="number" {...register("mileage")}></Input>
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
          <Input type="number" {...register("repairCost")}></Input>
        </Field>
        <HStack justify="end">
          <Button type="submit">Add Service Log</Button>
          <DialogCancelButton />
        </HStack>
      </Stack>
    </form>
  );
};
