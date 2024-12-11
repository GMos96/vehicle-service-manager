import Table from "@/components/ui/table";
import { useEffect, useState } from "react";
import { ServiceLogDTO } from "@/app/vehicles/types";
import { getServiceLogs } from "@/app/vehicles/service-log.actions";
import { formatDate } from "@/util/date-util";
import { DialogButton } from "@/components/ui/dialog-button";
import { BiPlus } from "react-icons/bi";
import { HStack, Stack } from "@chakra-ui/react";
import { AddServiceLogForm } from "@/app/vehicles/components/add-service-log-form";

export default function ServiceLogList({ vehicleId }: { vehicleId: number }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [serviceLogs, setServiceLogs] = useState<ServiceLogDTO[]>([]);

  useEffect(() => {
    setLoading(true);
    getServiceLogs(vehicleId).then((serviceLogs) => {
      setLoading(false);
      setServiceLogs(serviceLogs);
    });
  }, [vehicleId]);

  return (
    <Stack>
      <HStack justify="start" gap={2}>
        <DialogButton.Root>
          <DialogButton.Button>
            <BiPlus /> Add Service Log
          </DialogButton.Button>
          <DialogButton.Dialog title="Add Service Log">
            <AddServiceLogForm></AddServiceLogForm>
          </DialogButton.Dialog>
        </DialogButton.Root>
      </HStack>
      <Table.Root loading={loading} headerRow={HeaderRow} data={serviceLogs}>
        {serviceLogs.map((serviceLog) => (
          <Table.Row key={serviceLog.id}>
            <Table.Cell>{formatDate(serviceLog.serviceDate)}</Table.Cell>
            <Table.Cell>{serviceLog.serviceType}</Table.Cell>
            <Table.Cell>{serviceLog.mileage}</Table.Cell>
            <Table.Cell>{serviceLog.description}</Table.Cell>
            <Table.Cell>${serviceLog.repairCost}</Table.Cell>
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
    <Table.Cell>Mileage at Service</Table.Cell>
    <Table.Cell>Description</Table.Cell>
    <Table.Cell>Repair Cost</Table.Cell>
  </Table.Row>
);
