import { Field } from "@/components/ui/field";
import { HStack, Input } from "@chakra-ui/react";
import { CreateVehicleDTO } from "@/app/vehicles/types";
import { createVehicle, decodeVin } from "@/app/vehicles/vehicle.actions";
import { DialogCancelButton } from "@/components/ui/dialog";
import { ValidationError, ValidationErrors } from "@/types/validation-error";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { DialogButton } from "@/components/ui/dialog-button";
import { Button } from "@/components/ui/button";
import { showErrorToast, showSuccessToast } from "@/core/errors";
import { isValidVinFormat } from "@/util/vin";
import { BiCamera } from "react-icons/bi";
import VinScanner from "./vin-scanner";
import { fieldErrorsToValidationErrors } from "@/util/form-errors";

type Props = {
  onSuccess: (vehicleId: number) => void;
};

export default function AddVehicleForm({ onSuccess }: Props) {
  const { register, handleSubmit, getValues, setValue, formState } =
    useForm<CreateVehicleDTO>();
  const [serverErrors, setServerErrors] = useState<ValidationErrors>();
  const [decoding, setDecoding] = useState(false);
  const [scanning, setScanning] = useState(false);

  const errors = [
    ...fieldErrorsToValidationErrors(formState.errors),
    ...(serverErrors ?? []),
  ];

  const onSubmit = handleSubmit((data) => {
    createVehicle(data).then(
      (newVehicleId) => {
        showSuccessToast("Vehicle created");
        onSuccess(newVehicleId);
      },
      (errors: ValidationError[] | unknown) => {
        if (Array.isArray(errors)) {
          setServerErrors(errors);
        } else {
          showErrorToast(errors);
        }
      },
    );
  });

  const runDecode = (vin: string) => {
    setDecoding(true);
    decodeVin(vin).then(
      (decoded) => {
        setDecoding(false);
        if (decoded.year) setValue("year", decoded.year);
        if (decoded.make) setValue("make", decoded.make);
        if (decoded.model) setValue("model", decoded.model);
        if (decoded.trim) setValue("trim", decoded.trim);

        if (decoded.warning) {
          showErrorToast(decoded.warning, { title: "Partial match" });
        } else {
          showSuccessToast("VIN decoded — review and adjust as needed.");
        }
      },
      (error: unknown) => {
        setDecoding(false);
        showErrorToast(error);
      },
    );
  };

  const onDecode = () => {
    const vin = getValues("vin")?.trim() ?? "";
    if (!isValidVinFormat(vin)) {
      showErrorToast("Enter a valid 17-character VIN before decoding.");
      return;
    }
    runDecode(vin);
  };

  const onVinScanned = (vin: string) => {
    setScanning(false);
    setValue("vin", vin);
    runDecode(vin);
  };

  return (
    <form className="vsm-form" onSubmit={onSubmit}>
      <Field label="VIN" field="vin" errors={errors} optionalText=" (optional)">
        {scanning ? (
          <VinScanner
            onScan={onVinScanned}
            onCancel={() => setScanning(false)}
          />
        ) : (
          <HStack width="100%">
            <Input
              {...register("vin")}
              maxLength={17}
              data-testid="vin"
            ></Input>
            <Button
              type="button"
              variant="outline"
              onClick={() => setScanning(true)}
              data-testid="scanVinButton"
              aria-label="Scan VIN barcode"
            >
              <BiCamera />
            </Button>
            <Button
              type="button"
              variant="outline"
              loading={decoding}
              onClick={onDecode}
              data-testid="decodeVinButton"
            >
              Decode
            </Button>
          </HStack>
        )}
      </Field>
      <Field label="Year" field="year" width={200} errors={errors}>
        <Input
          type="number"
          inputMode="numeric"
          {...register("year", { valueAsNumber: true })}
          data-testid="year"
        ></Input>
      </Field>
      <HStack align="start">
        <Field label="Make" field="make" errors={errors} required>
          <Input
            {...register("make", { required: "Make is required" })}
            data-testid="make"
          ></Input>
        </Field>
        <Field label="Model" field="model" errors={errors} required>
          <Input
            {...register("model", { required: "Model is required" })}
            data-testid="model"
          ></Input>
        </Field>
        <Field label="Trim" width={200} field="trim" errors={errors}>
          <Input {...register("trim")} data-testid="trim"></Input>
        </Field>
      </HStack>
      <HStack>
        <Field label="Mileage" field="mileage" errors={errors} required>
          <Input
            type="number"
            inputMode="numeric"
            {...register("mileage", {
              required: "Mileage is required",
              valueAsNumber: true,
            })}
            data-testid="mileage"
          ></Input>
        </Field>
      </HStack>

      <HStack justify="end">
        <DialogButton.ActionButton
          type="submit"
          loading={formState.isSubmitting}
          data-testid="addVehicleSubmitButton"
        >
          Add Vehicle
        </DialogButton.ActionButton>
        <DialogCancelButton />
      </HStack>
    </form>
  );
}
