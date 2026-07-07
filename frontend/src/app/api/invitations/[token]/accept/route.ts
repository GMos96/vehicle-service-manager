import { NextResponse } from "next/server";
import { getUserFromToken } from "@/core/auth";
import { getDataSource } from "@/core/datasource/data-source";
import { VehicleInvitation } from "@/entities/vehicle-invitation/vehicle-invitation.entity";
import { VehicleAccess } from "@/entities/vehicle-access/vehicle-access.entity";
import { findOneVehicle } from "@/app/api/vehicles/vehicle.service";

type Params = { params: Promise<{ token: string }> };

export async function POST(request: Request, { params }: Params) {
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

    // Owner cannot accept their own invitation
    const vehicle = await findOneVehicle(inv.vehicleId, inv.userId);
    if (vehicle && inv.userId === user.userId) {
      return NextResponse.json({ message: "You cannot accept your own invitation" }, { status: 400 });
    }

    // Upsert access grant
    await ds.getRepository(VehicleAccess).upsert(
      { vehicleId: inv.vehicleId, userId: user.userId, level: inv.level },
      ["vehicleId", "userId"],
    );

    // Mark invitation accepted
    await ds.getRepository(VehicleInvitation).update({ id: inv.id }, { status: "ACCEPTED" });

    return NextResponse.json({ vehicleId: inv.vehicleId }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
