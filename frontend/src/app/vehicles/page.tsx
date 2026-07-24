"use client";

import { useMemo, useState } from "react";
import { Box, Flex, Heading, HStack, Input, Stack, Text } from "@chakra-ui/react";
import VehicleList from "@/app/vehicles/components/vehicle-list";
import AddVehicleButton from "@/app/vehicles/components/add-vehicle-button";
import { useFetchVehicles } from "@/app/vehicles/hooks/use-fetch-vehicles";
import { getVehicleDisplayName } from "@/app/vehicles/util";
import { Button } from "@/components/ui/button";
import { VehicleDTO } from "@/app/vehicles/types";

type SortOption = "recent" | "make" | "mileage";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recent", label: "Recently Updated" },
  { value: "make", label: "Make" },
  { value: "mileage", label: "Mileage" },
];

function sortVehicles(vehicles: VehicleDTO[], sort: SortOption): VehicleDTO[] {
  return [...vehicles].sort((a, b) => {
    switch (sort) {
      case "make":
        return a.make?.localeCompare(b.make ?? "") ?? 0;
      case "mileage":
        return (a.mileage ?? 0) - (b.mileage ?? 0);
      default:
        return (
          new Date(b.lastUpdatedDate ?? 0).getTime() -
          new Date(a.lastUpdatedDate ?? 0).getTime()
        );
    }
  });
}

export default function VehicleListPage() {
  const { data: vehicles, refresh, loading } = useFetchVehicles();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("recent");

  const visibleVehicles = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = term
      ? vehicles.filter((vehicle) =>
          getVehicleDisplayName(vehicle).toLowerCase().includes(term),
        )
      : vehicles;

    return sortVehicles(filtered, sort);
  }, [vehicles, search, sort]);

  return (
    <Box py={{ base: 8, md: 12 }}>
      <Flex
        justify="space-between"
        align="baseline"
        mb={7}
        pb={4}
        borderBottomWidth="1px"
        borderBottomColor="border.hairline"
        wrap="wrap"
        gap={3}
      >
        <Stack gap={1}>
          <Heading as="h1" fontFamily="heading" fontWeight="700" fontSize="2xl">
            My Garage
          </Heading>
          <Text
            fontFamily="mono"
            fontSize="xs"
            color="fg.subtle"
            textTransform="uppercase"
            letterSpacing="0.08em"
          >
            {vehicles?.length ?? 0} vehicles tracked
          </Text>
        </Stack>
        <AddVehicleButton onClose={() => refresh()} />
      </Flex>
      <Flex justify="space-between" align="center" mb={5} wrap="wrap" gap={3}>
        <Input
          placeholder="Search vehicles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxW={{ base: "full", sm: "xs" }}
          data-testid="vehicleSearch"
        />
        <HStack gap={2}>
          {SORT_OPTIONS.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={sort === option.value ? "solid" : "outline"}
              onClick={() => setSort(option.value)}
              data-testid={`sortBy-${option.value}`}
            >
              {option.label}
            </Button>
          ))}
        </HStack>
      </Flex>
      <VehicleList vehicles={visibleVehicles} loading={loading}></VehicleList>
    </Box>
  );
}
