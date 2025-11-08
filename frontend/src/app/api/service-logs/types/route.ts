// frontend/src/app/api/auth/service-logs/types/route.ts
import { NextResponse } from "next/server";
import { ServiceLogDescription, ServiceLogType } from "@/types/service-logs";

export async function GET() {
  try {
    const types = [
      {
        value: ServiceLogType.OIL_CHANGE,
        label: ServiceLogDescription.OIL_CHANGE,
      },
      {
        value: ServiceLogType.TIRE_ROTATION,
        label: ServiceLogDescription.TIRE_ROTATION,
      },
      { value: ServiceLogType.OTHER, label: ServiceLogDescription.OTHER },
    ];

    return NextResponse.json(types);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
