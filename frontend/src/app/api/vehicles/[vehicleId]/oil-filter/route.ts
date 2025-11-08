// frontend/src/app/api/auth/vehicles/[id]/oil-filter/route.ts
import { NextResponse } from "next/server";
import { updateOilFilter } from "../../vehicle.service";
import { getUserFromToken } from "@/core/auth";
import { VehicleParams } from "@/app/api/vehicles/types";

export async function PUT(request: Request, { params }: VehicleParams) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { vehicleId } = await params;
    const oilFilter = await updateOilFilter(+vehicleId, body, user.userId);
    return NextResponse.json(oilFilter);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
