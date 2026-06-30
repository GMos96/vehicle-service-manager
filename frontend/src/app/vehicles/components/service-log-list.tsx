import Table from "@/components/ui/table";
import { formatDate } from "@/util/date-util";
import { DialogButton } from "@/components/ui/dialog-button";
import { BiPlus } from "react-icons/bi";
import { HStack, Stack } from "@chakra-ui/react";
import { AddServiceLogForm } from "@/app/vehicles/components/add-service-log-form";
import { useFetchServiceLogs } from "@/app/vehicles/hooks/use-fetch-service-logs";
import { ServiceLogDTO } from "@/app/vehicles/types";

export default function ServiceLogList({ vehicleId }: { vehicleId: number }) {
  const { data, refresh, loading } = useFetchServiceLogs(vehicleId);

  return (
    <Stack>
      <HStack justify="start" gap={2}>
        <DialogButton.Root>
          <DialogButton.Button>
            <BiPlus /> Add Service Log
          </DialogButton.Button>
          <DialogButton.Dialog title="Add Service Log">
            <AddServiceLogForm
              vehicleId={vehicleId}
              onSave={() => refresh()}
            ></AddServiceLogForm>
          </DialogButton.Dialog>
        </DialogButton.Root>
      </HStack>
      <Table.Root loading={loading} headerRow={HeaderRow} data={data}>
        {[...data]
          .sort((a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime())
          .map((serviceLog: ServiceLogDTO) => (
            <Table.Row key={serviceLog.id}>
              <Table.Cell fontFamily="mono" fontSize="sm" color="fg.muted">
                {formatDate(serviceLog.serviceDate, "MM-DD-YYYY")}
              </Table.Cell>
              <Table.Cell fontFamily="heading" fontWeight="500">
                {serviceLog.serviceType}
              </Table.Cell>
              <Table.Cell
                display={{ base: "none", sm: "table-cell" }}
                className="vsm-mono-num"
              >
                {serviceLog.mileage?.toLocaleString()} mi
              </Table.Cell>
              <Table.Cell display={{ base: "none", sm: "table-cell" }}>
                {serviceLog.description}
              </Table.Cell>
              <Table.Cell
                display={{ base: "none", md: "table-cell" }}
                className="vsm-mono-num"
                color="accent.solidColor"
              >
                ${serviceLog.repairCost}
              </Table.Cell>
            </Table.Row>
          ))}
      </Table.Root>
    </Stack>
  );
}

const HeaderRow = (
  <Table.Row>
    <Table.Cell>Date</Table.Cell>
    <Table.Cell>Service Type</Table.Cell>
    <Table.Cell display={{ base: "none", sm: "table-cell" }}>
      Mileage at Service
    </Table.Cell>
    <Table.Cell display={{ base: "none", sm: "table-cell" }}>
      Description
    </Table.Cell>
    <Table.Cell display={{ base: "none", md: "table-cell" }}>
      Repair Cost
    </Table.Cell>
  </Table.Row>
);
