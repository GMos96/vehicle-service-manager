"use client";

import { useMemo, useState } from "react";
import Table from "@/components/ui/table";
import EmptyState from "@/components/ui/empty-state";
import { formatDate } from "@/util/date-util";
import { formatCurrency } from "@/util/currency";
import { DialogButton } from "@/components/ui/dialog-button";
import { Button } from "@/components/ui/button";
import { BiChevronDown, BiChevronUp, BiPlus } from "react-icons/bi";
import {
  Box,
  Flex,
  HStack,
  Input,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AddServiceLogForm } from "@/app/vehicles/components/add-service-log-form";
import { useFetchServiceLogs } from "@/app/vehicles/hooks/use-fetch-service-logs";
import { ServiceLogDTO } from "@/app/vehicles/types";

const PAGE_SIZE = 25;
const PAGINATE_THRESHOLD = 50;

type SortField = "serviceDate" | "mileage" | "repairCost";
type SortDirection = "asc" | "desc";

function sortLogs(
  logs: ServiceLogDTO[],
  field: SortField,
  direction: SortDirection,
): ServiceLogDTO[] {
  const multiplier = direction === "asc" ? 1 : -1;
  return [...logs].sort((a, b) => {
    switch (field) {
      case "mileage":
        return ((a.mileage ?? 0) - (b.mileage ?? 0)) * multiplier;
      case "repairCost":
        return ((a.repairCost ?? 0) - (b.repairCost ?? 0)) * multiplier;
      default:
        return (
          (new Date(a.serviceDate).getTime() -
            new Date(b.serviceDate).getTime()) *
          multiplier
        );
    }
  });
}

export default function ServiceLogList({ vehicleId }: { vehicleId: number }) {
  const { data, refresh, loading } = useFetchServiceLogs(vehicleId);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("serviceDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(0);

  const filteredAndSorted = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = term
      ? data.filter((log) =>
          [log.serviceType, log.description].some((value) =>
            value?.toLowerCase().includes(term),
          ),
        )
      : data;

    return sortLogs(filtered, sortField, sortDirection);
  }, [data, search, sortField, sortDirection]);

  const paginate = filteredAndSorted.length > PAGINATE_THRESHOLD;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSorted.length / PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages - 1);
  const visibleLogs = paginate
    ? filteredAndSorted.slice(
        currentPage * PAGE_SIZE,
        (currentPage + 1) * PAGE_SIZE,
      )
    : filteredAndSorted;

  function toggleSort(field: SortField) {
    setSortField((currentField) => {
      if (currentField === field) {
        setSortDirection((direction) =>
          direction === "asc" ? "desc" : "asc",
        );
        return currentField;
      }
      setSortDirection("desc");
      return field;
    });
    setPage(0);
  }

  return (
    <Stack gap={4}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
        <DialogButton.Root>
          <DialogButton.Button id="addServiceLogButton">
            <BiPlus /> Add Service Log
          </DialogButton.Button>
          <DialogButton.Dialog title="Add Service Log">
            <AddServiceLogForm
              vehicleId={vehicleId}
              onSave={() => refresh()}
            ></AddServiceLogForm>
          </DialogButton.Dialog>
        </DialogButton.Root>
        <Input
          placeholder="Search service logs..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          maxW={{ base: "full", sm: "xs" }}
          data-testid="serviceLogSearch"
        />
      </Flex>

      <Box display={{ base: "none", sm: "block" }}>
        <Table.Root
          loading={loading}
          headerRow={
            <SortableHeaderRow
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={toggleSort}
            />
          }
          data={filteredAndSorted}
        >
          {visibleLogs.map((serviceLog) => (
            <Table.Row key={serviceLog.id}>
              <Table.Cell fontFamily="mono" fontSize="sm" color="fg.muted">
                {formatDate(serviceLog.serviceDate, "MM-DD-YYYY")}
              </Table.Cell>
              <Table.Cell fontFamily="heading" fontWeight="500">
                {serviceLog.serviceType}
              </Table.Cell>
              <Table.Cell className="vsm-mono-num">
                {serviceLog.mileage?.toLocaleString()} mi
              </Table.Cell>
              <Table.Cell>{serviceLog.description}</Table.Cell>
              <Table.Cell className="vsm-mono-num" color="accent.solidColor">
                {formatCurrency(serviceLog.repairCost)}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Root>
      </Box>

      <Box display={{ base: "block", sm: "none" }}>
        {loading ? (
          <Flex justify="center" py={8}>
            <Spinner color="accent.solidColor" />
          </Flex>
        ) : filteredAndSorted.length === 0 ? (
          <EmptyState message="No records found" />
        ) : (
          <VStack align="stretch" gap={3}>
            {visibleLogs.map((serviceLog) => (
              <ServiceLogCard key={serviceLog.id} serviceLog={serviceLog} />
            ))}
          </VStack>
        )}
      </Box>

      {paginate && (
        <Pager
          page={currentPage}
          totalPages={totalPages}
          onChange={setPage}
        />
      )}
    </Stack>
  );
}

function SortableHeaderRow({
  sortField,
  sortDirection,
  onSort,
}: {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}) {
  return (
    <Table.Row>
      <SortableHeaderCell
        field="serviceDate"
        label="Date"
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={onSort}
      />
      <Table.Cell>Service Type</Table.Cell>
      <SortableHeaderCell
        field="mileage"
        label="Mileage at Service"
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={onSort}
      />
      <Table.Cell>Description</Table.Cell>
      <SortableHeaderCell
        field="repairCost"
        label="Repair Cost"
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={onSort}
      />
    </Table.Row>
  );
}

function SortableHeaderCell({
  field,
  label,
  sortField,
  sortDirection,
  onSort,
}: {
  field: SortField;
  label: string;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}) {
  const isActive = sortField === field;

  return (
    <Table.Cell
      cursor="pointer"
      onClick={() => onSort(field)}
      data-testid={`sortHeader-${field}`}
    >
      <HStack gap={1} userSelect="none">
        <span>{label}</span>
        {isActive &&
          (sortDirection === "asc" ? (
            <BiChevronUp aria-hidden />
          ) : (
            <BiChevronDown aria-hidden />
          ))}
      </HStack>
    </Table.Cell>
  );
}

function ServiceLogCard({ serviceLog }: { serviceLog: ServiceLogDTO }) {
  return (
    <Box
      borderWidth="1px"
      borderColor="border.hairline"
      borderRadius="md"
      bg="bg.panel"
      p={4}
    >
      <Flex justify="space-between" align="baseline" mb={2}>
        <Text fontFamily="heading" fontWeight="600">
          {serviceLog.serviceType}
        </Text>
        <Text fontFamily="mono" fontSize="xs" color="fg.muted">
          {formatDate(serviceLog.serviceDate, "MM-DD-YYYY")}
        </Text>
      </Flex>
      {serviceLog.description && (
        <Text fontSize="sm" color="fg.muted" mb={2}>
          {serviceLog.description}
        </Text>
      )}
      <Flex justify="space-between" fontSize="sm">
        <Text className="vsm-mono-num" color="fg.subtle">
          {serviceLog.mileage?.toLocaleString()} mi
        </Text>
        <Text className="vsm-mono-num" color="accent.solidColor">
          {formatCurrency(serviceLog.repairCost)}
        </Text>
      </Flex>
    </Box>
  );
}

function Pager({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  return (
    <HStack justify="center" gap={3}>
      <Button
        size="sm"
        variant="outline"
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
        data-testid="serviceLogPrevPage"
      >
        Previous
      </Button>
      <Text fontFamily="mono" fontSize="xs" color="fg.subtle">
        Page {page + 1} of {totalPages}
      </Text>
      <Button
        size="sm"
        variant="outline"
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
        data-testid="serviceLogNextPage"
      >
        Next
      </Button>
    </HStack>
  );
}
