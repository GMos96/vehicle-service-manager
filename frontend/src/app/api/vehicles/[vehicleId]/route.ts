// frontend/src/app/api/auth/vehicles/[id]/route.ts
import { NextResponse } from "next/server";
import {
  findOneVehicle,
  removeVehicle,
  updateAllVehicleData,
} from "../vehicle.service";
import { getUserFromToken } from "@/core/auth";
import { VehicleParams } from "@/app/api/vehicles/types";

export async function GET(request: Request, { params }: VehicleParams) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { vehicleId } = await params;
    const vehicle = await findOneVehicle(+vehicleId, user.userId);
    if (!vehicle) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: VehicleParams) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { vehicleId } = await params;
    await updateAllVehicleData(+vehicleId, body, user.userId);
    const vehicle = await findOneVehicle(+vehicleId, user.userId);
    return NextResponse.json(vehicle);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: VehicleParams) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { vehicleId } = await params;
    await removeVehicle(+vehicleId, user.userId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
