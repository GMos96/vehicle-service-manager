"use client";

import { useEffect, useState } from "react";
import {
  OilDTO,
  OilFilterDTO,
  TireDTO,
  UpdateVehicleDTO,
  VehicleDTO,
} from "@/app/vehicles/types";
import {
  Card,
  Container,
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
  DataListRoot,
  Group,
  Link,
  Separator,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { getVehicle, updateVehicle } from "@/app/vehicles/vehicle.actions";
import { BiArrowBack } from "react-icons/bi";
import EditableInput from "@/components/ui/editable-input";
import OilSection from "@/app/vehicles/[id]/components/oil-section";
import OilFilterSection from "@/app/vehicles/[id]/components/oil-filter-section";
import TireSection from "@/app/vehicles/[id]/components/tire-section";

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

    fetchVehicle().then((vehicle) => setVehicle(vehicle));
  }, [params]);

  function onEdit(vehicleEdit: Partial<UpdateVehicleDTO>) {
    updateVehicle({ ...vehicle, ...vehicleEdit }).then((vehicle) =>
      setVehicle(vehicle),
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
    return <Spinner></Spinner>;
  }

  return (
    <Container>
      <Stack gap={4}>
        <Link href="/vehicles">
          <BiArrowBack></BiArrowBack>
          Back to Vehicle List
        </Link>
        <Card.Root>
          <Card.Header>
            <Card.Title>
              {vehicle?.year} {vehicle?.make} {vehicle?.model} {vehicle?.trim}
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Stack gap={4}>
              <DataListRoot orientation="vertical">
                <Group grow>
                  <DataListItem>
                    <DataListItemLabel>
                      Mileage of Last Service
                    </DataListItemLabel>
                    <DataListItemValue>
                      <EditableInput
                        value={vehicle?.mileage?.toString()}
                        onChange={(mileage) => onEdit({ mileage: +mileage })}
                      ></EditableInput>
                    </DataListItemValue>
                  </DataListItem>
                  <DataListItem>
                    <DataListItemLabel>Date of Last Service</DataListItemLabel>
                    <DataListItemValue>
                      {vehicle?.lastUpdatedDate}
                    </DataListItemValue>
                  </DataListItem>
                </Group>
              </DataListRoot>
              <Separator></Separator>
              <OilSection oil={vehicle?.oil} onEdit={onOilEdit}></OilSection>
              <Separator></Separator>
              <OilFilterSection
                oilFilter={vehicle?.oilFilter}
                onEdit={onOilFilterEdit}
              ></OilFilterSection>
              <Separator></Separator>
              <TireSection
                onEdit={onTireEdit}
                tire={vehicle?.tire}
              ></TireSection>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Stack>
    </Container>
  );
}
