"use client";

import { useEffect, useState } from "react";
import {
  OilDTO,
  OilFilterDTO,
  TireDTO,
  UpdateVehicleDTO,
  VehicleDTO,
} from "@/app/vehicles/types";
import { Box, Flex, Heading, Separator, Spinner, Stack } from "@chakra-ui/react";
import { getVehicle, updateVehicle } from "@/app/vehicles/vehicle.actions";
import OilSection from "@/app/vehicles/[id]/components/oil-section";
import OilFilterSection from "@/app/vehicles/[id]/components/oil-filter-section";
import TireSection from "@/app/vehicles/[id]/components/tire-section";
import VehicleSection from "@/app/vehicles/[id]/components/vehicle-section";
import Link from "@/components/ui/link";
import { BiArrowBack } from "react-icons/bi";
import { getVehicleDisplayName } from "@/app/vehicles/util";
import ServiceLogList from "@/app/vehicles/components/service-log-list";
import RecallsSection from "@/app/vehicles/[id]/components/recalls-section";
import AnalyticsSection from "@/app/vehicles/[id]/components/analytics-section";
import MaintenanceSection from "@/app/vehicles/[id]/components/maintenance-section";
import { showErrorToast } from "@/core/errors";

type Params = { id: number };
type Props = {
  params: Promise<Params>;
};

export default function VehicleOverviewPage({ params }: Props) {
  const [vehicle, setVehicle] = useState<VehicleDTO>();

  useEffect((): void => {
    const fetchVehicle = async () => {
      const vehicleId = (await params)?.id;
      return getVehicle(vehicleId);
    };

    fetchVehicle().then((vehicle) => setVehicle(vehicle), showErrorToast);
  }, [params]);

  function onEdit(vehicleEdit: Partial<UpdateVehicleDTO>) {
    updateVehicle({ ...vehicle, ...vehicleEdit }).then(
      (vehicle) => setVehicle(vehicle),
      showErrorToast,
    );
  }

  function onOilEdit(oilEdit: Partial<OilDTO>) {
    const id = vehicle?.oil?.id;
    onEdit({ oil: { ...oilEdit, id } as OilDTO });
  }

  function onOilFilterEdit(oilFilter: Partial<OilFilterDTO>) {
    const id = vehicle?.oilFilter?.id;
    onEdit({ oilFilter: { ...oilFilter, id } as OilFilterDTO });
  }

  function onTireEdit(tire: Partial<TireDTO>) {
    const id = vehicle?.tire?.id;
    onEdit({ tire: { ...tire, id } as TireDTO });
  }

  if (!vehicle) {
    return (
      <Flex justify="center" py={20}>
        <Spinner color="accent.solidColor"></Spinner>
      </Flex>
    );
  }

  return (
    <Box py={{ base: 8, md: 12 }}>
      <Stack gap={6}>
        <Link href="/vehicles">
          <Flex align="center" gap={2}>
            <BiArrowBack></BiArrowBack>
            Back to Vehicle List
          </Flex>
        </Link>

        <Panel title={getVehicleDisplayName(vehicle)}>
          <Stack gap={5}>
            <VehicleSection vehicle={vehicle} onEdit={onEdit}></VehicleSection>
            <Separator borderColor="border.hairline"></Separator>
            <OilSection oil={vehicle?.oil} onEdit={onOilEdit}></OilSection>
            <Separator borderColor="border.hairline"></Separator>
            <OilFilterSection
              oilFilter={vehicle?.oilFilter}
              onEdit={onOilFilterEdit}
            ></OilFilterSection>
            <Separator borderColor="border.hairline"></Separator>
            <TireSection
              onEdit={onTireEdit}
              tire={vehicle?.tire ?? {}}
            ></TireSection>
          </Stack>
        </Panel>

        <Panel title="Service Logs">
          <ServiceLogList vehicleId={vehicle?.id}></ServiceLogList>
        </Panel>

        <Panel title="Maintenance Schedule">
          <MaintenanceSection vehicleId={vehicle?.id}></MaintenanceSection>
        </Panel>

        <Panel title="Cost Analytics">
          <AnalyticsSection vehicleId={vehicle?.id}></AnalyticsSection>
        </Panel>

        <Panel title="Recalls">
          <RecallsSection vehicleId={vehicle?.id}></RecallsSection>
        </Panel>
      </Stack>
    </Box>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border.hairline"
      borderTopWidth="2px"
      borderTopColor="accent.solidColor"
      borderRadius="md"
      px={{ base: 5, md: 7 }}
      py={6}
    >
      <Heading
        as="h2"
        fontFamily="heading"
        fontWeight="600"
        fontSize="lg"
        mb={5}
      >
        {title}
      </Heading>
      {children}
    </Box>
  );
}
