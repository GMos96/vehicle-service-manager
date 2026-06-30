"use client";

import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import VehicleList from "@/app/vehicles/components/vehicle-list";
import AddVehicleButton from "@/app/vehicles/components/add-vehicle-button";
import { useFetchVehicles } from "@/app/vehicles/hooks/use-fetch-vehicles";

export default function VehicleListPage() {
  const { data: vehicles, refresh, loading } = useFetchVehicles();

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
      <VehicleList vehicles={vehicles} loading={loading}></VehicleList>
    </Box>
  );
}
