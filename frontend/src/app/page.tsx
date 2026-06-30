"use client";

import React from "react";
import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import GaugePanel from "@/components/ui/gauge-panel";
import { VehicleDTO } from "@/app/vehicles/types";

const MILEAGE_CEILING = 100000;

export default function Home() {
  const router = useRouter();
  const vehicles = sampleList();

  return (
    <Box>
      <Box pt={{ base: 14, md: 20 }} pb={12} maxW="3xl">
        <Flex align="center" gap={2.5} mb={4}>
          <Box w="18px" h="1px" bg="accent.solidColor" />
          <Text
            fontFamily="mono"
            fontSize="xs"
            letterSpacing="0.16em"
            textTransform="uppercase"
            color="accent.solidColor"
          >
            Maintenance, instrumented
          </Text>
        </Flex>
        <Heading
          as="h1"
          fontFamily="heading"
          fontWeight="700"
          fontSize={{ base: "4xl", md: "5xl" }}
          lineHeight="1.05"
          letterSpacing="-0.01em"
          mb={6}
        >
          Every oil change, tire, and repair —{" "}
          <Text as="span" color="accent.solidColor">
            read like a gauge.
          </Text>
        </Heading>
        <Text fontSize="lg" color="fg.muted" maxW="lg" mb={9} lineHeight="1.6">
          Track mileage, service history, and parts for every vehicle you
          own. No spreadsheets, no guessing what&apos;s due — just{" "}
          <Text as="span" fontFamily="mono" color="accent.solidColor" fontSize="md">
            84,210 mi
          </Text>{" "}
          and counting.
        </Text>
        <Flex gap={4} align="center">
          <Button onClick={() => router.push("/login")}>Get started</Button>
          <Button
            variant="outline"
            onClick={() =>
              document
                .getElementById("sample-garage")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            See a sample garage
          </Button>
        </Flex>
      </Box>

      <Box id="sample-garage" pb={20}>
        <Flex
          justify="space-between"
          align="baseline"
          mb={7}
          pb={4}
          borderBottomWidth="1px"
          borderBottomColor="border.hairline"
        >
          <Heading as="h2" fontFamily="heading" fontWeight="600" fontSize="xl">
            Sample Garage
          </Heading>
          <Text
            fontFamily="mono"
            fontSize="xs"
            color="fg.subtle"
            textTransform="uppercase"
            letterSpacing="0.08em"
          >
            {vehicles.length} vehicles tracked
          </Text>
        </Flex>

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={5}>
          {vehicles.map((vehicle) => (
            <GaugePanel
              key={vehicle.id}
              title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              subtitle={vehicle.trim}
              tag="MI"
              value={vehicle.mileage.toLocaleString()}
              unit="mi"
              arcFill={Math.min(vehicle.mileage / MILEAGE_CEILING, 1)}
              footerLabel="Last service"
              footerValue="—"
            />
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

function sampleList(): VehicleDTO[] {
  return [
    {
      id: 1,
      year: 2022,
      make: "Ford",
      model: "F-150",
      trim: "Platinum",
      mileage: 15000,
      nextRecommendedServiceMileage: 18000,
    },
    {
      id: 2,
      year: 2016,
      make: "Honda",
      model: "Accord",
      trim: "EX-L",
      mileage: 53000,
      nextRecommendedServiceMileage: 56000,
    },
  ];
}
