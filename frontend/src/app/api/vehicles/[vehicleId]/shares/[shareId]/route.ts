import { NextResponse } from "next/server";
import { getUserFromToken } from "@/core/auth";
import { findOneVehicle } from "../../../vehicle.service";
import { getDataSource } from "@/core/datasource/data-source";
import { VehicleAccess } from "@/entities/vehicle-access/vehicle-access.entity";
import { VehicleInvitation } from "@/entities/vehicle-invitation/vehicle-invitation.entity";

type Params = { params: Promise<{ vehicleId: string; shareId: string }> };

export async function DELETE(request: Request, { params }: Params) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { vehicleId, shareId } = await params;
    const vehicle = await findOneVehicle(+vehicleId, user.userId);
    if (!vehicle) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const ds = await getDataSource();

    // Try revoking an active access grant
    const access = await ds.getRepository(VehicleAccess).findOneBy({
      id: +shareId,
      vehicleId: +vehicleId,
    });
    if (access) {
      await ds.getRepository(VehicleAccess).delete({ id: +shareId });
      return new NextResponse(null, { status: 204 });
    }

    // Try revoking a pending invitation
    const inv = await ds.getRepository(VehicleInvitation).findOneBy({
      id: +shareId,
      vehicleId: +vehicleId,
    });
    if (inv) {
      await ds.getRepository(VehicleInvitation).update({ id: +shareId }, { status: "REVOKED" });
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json({ message: "Not found" }, { status: 404 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
