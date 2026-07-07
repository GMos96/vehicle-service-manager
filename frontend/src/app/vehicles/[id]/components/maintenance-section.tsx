"use client";

import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { useFetchMaintenance } from "@/app/vehicles/hooks/use-fetch-maintenance";
import { MaintenanceItemDTO, MaintenanceStatus } from "@/app/vehicles/types";
import dayjs from "dayjs";

const STATUS_COLOR: Record<MaintenanceStatus, string> = {
  overdue: "red.500",
  due_soon: "orange.400",
  ok: "green.500",
  unknown: "fg.subtle",
};

const STATUS_BG: Record<MaintenanceStatus, string> = {
  overdue: "red.subtle",
  due_soon: "orange.subtle",
  ok: "green.subtle",
  unknown: "bg.subtle",
};

const STATUS_LABEL: Record<MaintenanceStatus, string> = {
  overdue: "Overdue",
  due_soon: "Due Soon",
  ok: "OK",
  unknown: "Unknown",
};

function MaintenanceItem({ item }: { item: MaintenanceItemDTO }) {
  const details: string[] = [];
  if (item.dueMileage !== undefined) {
    details.push(`@ ${item.dueMileage.toLocaleString()} mi`);
  }
  if (item.dueDate) {
    details.push(`by ${dayjs(item.dueDate).format("MMM D, YYYY")}`);
  }

  return (
    <Flex
      align="center"
      justify="space-between"
      py={3}
      borderBottomWidth="1px"
      borderColor="border.hairline"
      _last={{ borderBottomWidth: 0 }}
    >
      <Box>
        <Text fontFamily="heading" fontWeight="500" fontSize="sm">
          {item.label}
        </Text>
        {details.length > 0 && (
          <Text fontSize="xs" color="fg.muted" mt={0.5}>
            {details.join(" · ")}
          </Text>
        )}
      </Box>
      <Box
        px={2.5}
        py={1}
        borderRadius="md"
        bg={STATUS_BG[item.status]}
        color={STATUS_COLOR[item.status]}
        fontSize="xs"
        fontWeight="600"
        textTransform="uppercase"
        letterSpacing="wide"
        flexShrink={0}
        ml={3}
      >
        {STATUS_LABEL[item.status]}
      </Box>
    </Flex>
  );
}

export default function MaintenanceSection({
  vehicleId,
}: {
  vehicleId: number;
}) {
  const { data, loading, error } = useFetchMaintenance(vehicleId);

  if (error) {
    return (
      <Box color="fg.subtle" fontSize="sm">
        Unable to load maintenance schedule right now.
      </Box>
    );
  }

  if (loading) {
    return (
      <Box color="fg.subtle" fontSize="sm">
        Loading…
      </Box>
    );
  }

  return (
    <Stack gap={0}>
      {data.map((item) => (
        <MaintenanceItem key={item.kind} item={item} />
      ))}
    </Stack>
  );
}
