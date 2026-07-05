import { NextResponse } from "next/server";
import { getUserFromToken } from "@/core/auth";
import { findOneVehicle } from "../../vehicle.service";
import { getRecallsByVehicle, NhtsaUnavailableError } from "../../nhtsa.service";
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

    const recalls = await getRecallsByVehicle(
      vehicle.make,
      vehicle.model,
      vehicle.year,
    );
    return NextResponse.json(recalls);
  } catch (error) {
    if (error instanceof NhtsaUnavailableError) {
      return NextResponse.json(
        { message: "Recall service is temporarily unavailable" },
        { status: 503 },
      );
    }
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
