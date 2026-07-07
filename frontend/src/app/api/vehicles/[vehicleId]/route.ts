// frontend/src/app/api/auth/vehicles/[id]/route.ts
import { NextResponse } from "next/server";
import {
  findOneVehicle,
  removeVehicle,
  updateAllVehicleData,
} from "../vehicle.service";
import { getUserFromToken } from "@/core/auth";
import { VehicleParams } from "@/app/api/vehicles/types";
import { resolveVehicleAccess } from "@/core/access/vehicle-access.service";

export async function GET(request: Request, { params }: VehicleParams) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { vehicleId } = await params;
    const access = await resolveVehicleAccess(+vehicleId, user.userId);
    if (!access) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const vehicle = await findOneVehicle(+vehicleId, access.ownerUserId);
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

    const { vehicleId } = await params;
    const access = await resolveVehicleAccess(+vehicleId, user.userId);
    if (!access) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    if (!access.canWrite) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    await updateAllVehicleData(+vehicleId, body, access.ownerUserId);
    const vehicle = await findOneVehicle(+vehicleId, access.ownerUserId);
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
    const access = await resolveVehicleAccess(+vehicleId, user.userId);
    if (!access) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    if (!access.isOwner) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await removeVehicle(+vehicleId, access.ownerUserId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
