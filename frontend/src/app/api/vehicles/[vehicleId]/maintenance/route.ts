import { NextResponse } from "next/server";
import { getUserFromToken } from "@/core/auth";
import { findOneVehicle } from "../../vehicle.service";
import { getServiceLogs } from "@/app/api/service-logs/service-logs.service";
import { computeMaintenanceItems } from "@/app/vehicles/maintenance";
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
    if (!vehicle) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const logs = await getServiceLogs(+vehicleId, access.ownerUserId);
    const items = computeMaintenanceItems(vehicle, logs);
    return NextResponse.json(items);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
