"use client";

import { VehicleDTO } from "@/app/vehicles/types";
import { getVehicleDisplayName } from "@/app/vehicles/util";
import { formatDate } from "@/util/date-util";
import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import type { KeyboardEvent } from "react";

type Props = {
  vehicle: VehicleDTO;
  onClick?: () => void;
};

export default function VehicleCard({ vehicle, onClick }: Props) {
  const oilTypeDisplay = vehicle.oil?.type
    ? vehicle.oil.type.charAt(0).toUpperCase() + vehicle.oil.type.slice(1)
    : "Standard";

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  }

  return (
    <Box
      onClick={onClick}
      cursor={onClick ? "pointer" : "default"}
      p={5}
      border="1px"
      borderColor="border.hairline"
      borderRadius="md"
      bg="bg.subtle"
      transition="all 0.2s"
      data-testid={`vehicleCard-${vehicle.id}`}
      _hover={
        onClick
          ? {
              shadow: "md",
            }
          : undefined
      }
      _focusVisible={
        onClick
          ? {
              outline: "2px solid",
              outlineColor: "accent.solidColor",
              outlineOffset: "2px",
            }
          : undefined
      }
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
    >
      {/* Vehicle Name */}
      <Text
        fontFamily="heading"
        fontWeight="700"
        fontSize="lg"
        mb={3}
      >
        {getVehicleDisplayName(vehicle)}
      </Text>

      {/* Mileage + Oil Type Row */}
      <HStack justify="space-between" mb={3}>
        <Text className="vsm-mono-num" fontSize="md">
          {vehicle.mileage?.toLocaleString()} mi
        </Text>
        <Box
          as="span"
          fontSize="xs"
          textTransform="uppercase"
          px={2}
          py={1}
          borderRadius="sm"
          bg="accent.focusRing"
          color="fg.inverted"
          fontWeight="600"
        >
          {oilTypeDisplay}
        </Box>
      </HStack>

      {vehicle.nextRecommendedServiceMileage !== undefined && (
        <Box
          p={3}
          mb={3}
          borderRadius="sm"
        >
          <Text fontSize="sm" color="fg.muted" mb={1}>
            Next Service
          </Text>
          <Text className="vsm-mono-num" fontSize="md" fontWeight="600" color="accent.solidColor">
            @ {vehicle.nextRecommendedServiceMileage.toLocaleString()} mi
          </Text>
        </Box>
      )}

      {/* Last Updated Footer */}
      <Text
        fontFamily="mono"
        fontSize="xs"
        color="fg.muted"
      >
        Updated {formatDate(vehicle.lastUpdatedDate)}
      </Text>
    </Box>
  );
}
