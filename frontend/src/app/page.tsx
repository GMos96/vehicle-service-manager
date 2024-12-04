"use client";

import React from "react";
import { Button, Card, Flex, Heading, Separator } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import VehicleList from "@/app/vehicles/components/vehicle-list";
import { VehicleDTO } from "@/app/vehicles/types";

export default function Home() {
  const router = useRouter();

  return (
    <Flex
      className="prelogin-background"
      align="center"
      direction="column"
      gap={5}
    >
      <Heading as="h1" size="4xl" mt={5}>
        Simple, Flexible, Vehicle Maintenance
      </Heading>
      <Heading as="h2" size="sm">
        Manage your vehicles&#39; maintenance with ease. Track oil changes, tire
        rotations, and other repairs.
      </Heading>
      <Button onClick={() => router.push("login")}>Get Started now!</Button>
      <Separator></Separator>
      <Card.Root minW="2xl">
        <Card.Header>
          <Card.Title>Sample Garage</Card.Title>
        </Card.Header>
        <Card.Body>
          <VehicleList
            vehicles={sampleList()}
            loading={false}
            enableClickToNavigate={false}
          ></VehicleList>
        </Card.Body>
      </Card.Root>
    </Flex>
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
    },
    {
      id: 2,
      year: 2016,
      make: "Honda",
      model: "Accord",
      trim: "EX-L",
      mileage: 53000,
    },
  ];
}
