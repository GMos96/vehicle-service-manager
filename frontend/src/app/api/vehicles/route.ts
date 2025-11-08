// frontend/src/app/api/auth/vehicles/route.ts
import { NextResponse } from "next/server";
import { createVehicle, findAllVehicles } from "./vehicle.service";
import { getUserFromToken } from "@/core/auth";

export async function POST(request: Request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const vehicle = await createVehicle(body, user.userId);
    return NextResponse.json(vehicle, { status: 201 });
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
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
