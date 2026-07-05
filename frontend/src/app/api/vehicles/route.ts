// frontend/src/app/api/auth/vehicles/route.ts
import { NextResponse } from "next/server";
import { validate, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";
import { QueryFailedError } from "typeorm";
import { createVehicle, findAllVehicles } from "./vehicle.service";
import { getUserFromToken } from "@/core/auth";
import { calculateNextRecommendedServiceMileage } from "@/app/vehicles/util";
import { VehicleDTO } from "@/app/vehicles/types";
import { CreateVehicleDto } from "@/vehicles/types/dto/create-vehicle.dto";

function mapValidationErrors(errors: ValidationError[]) {
  return errors.map((error) => ({
    property: error.property,
    message:
      Object.values(error.constraints ?? {}).join(", ") || "Invalid value",
  }));
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    body.vin = body.vin ? body.vin.trim().toUpperCase() : undefined;

    const dto = plainToInstance(CreateVehicleDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      return NextResponse.json(
        { message: mapValidationErrors(errors), status: 400 },
        { status: 400 },
      );
    }

    try {
      const vehicle = await createVehicle(dto, user.userId);
      return NextResponse.json(vehicle, { status: 201 });
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string })?.code === "23505"
      ) {
        return NextResponse.json(
          {
            message: [
              {
                property: "vin",
                message: "You already have a vehicle with this VIN",
              },
            ],
            status: 409,
          },
          { status: 409 },
        );
      }
      throw error;
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const vehicles = await findAllVehicles(user.userId);

    // Calculate nextRecommendedServiceMileage for each vehicle
    const vehiclesWithServiceMileage = vehicles.map(vehicle => {
      const vehicleDTO: VehicleDTO = {
        ...vehicle,
        nextRecommendedServiceMileage: 0, // placeholder
      };
      return {
        ...vehicle,
        nextRecommendedServiceMileage: calculateNextRecommendedServiceMileage(vehicleDTO),
      };
    });

    return NextResponse.json(vehiclesWithServiceMileage);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
