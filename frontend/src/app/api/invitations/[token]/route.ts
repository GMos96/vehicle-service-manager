import { NextResponse } from "next/server";
import { getUserFromToken } from "@/core/auth";
import { getDataSource } from "@/core/datasource/data-source";
import { VehicleInvitation } from "@/entities/vehicle-invitation/vehicle-invitation.entity";
import { findOneVehicle } from "@/app/api/vehicles/vehicle.service";

type Params = { params: Promise<{ token: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { token } = await params;
    const ds = await getDataSource();
    const inv = await ds.getRepository(VehicleInvitation).findOneBy({ token });

    if (!inv) {
      return NextResponse.json({ message: "Invitation not found" }, { status: 404 });
    }

    if (inv.status !== "PENDING") {
      return NextResponse.json({ message: `Invitation is ${inv.status.toLowerCase()}` }, { status: 410 });
    }

    if (new Date() > inv.expiresAt) {
      return NextResponse.json({ message: "Invitation has expired" }, { status: 410 });
    }

    const vehicle = await findOneVehicle(inv.vehicleId, inv.userId);

    return NextResponse.json({
      vehicleId: inv.vehicleId,
      vehicleName: vehicle
        ? `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`
        : "Unknown vehicle",
      level: inv.level,
      inviteeEmail: inv.inviteeEmail,
      expiresAt: inv.expiresAt,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
