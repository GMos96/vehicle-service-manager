// frontend/src/app/api/auth/service-logs/route.ts
import { NextResponse } from "next/server";
import { getUserFromToken } from "@/core/auth";
import {
  createServiceLog,
  getServiceLogs,
} from "@/app/api/service-logs/service-logs.service";
import { ServiceLogDescription } from "@/types/service-logs";

export async function POST(request: Request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const serviceLog = {
      ...body,
      userId: user.userId,
      serviceDate: body.serviceDate || new Date(),
    };

    const result = await createServiceLog(
      serviceLog,
      serviceLog.vehicleId,
      user.userId,
    );

    return NextResponse.json(result, { status: 201 });
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

    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get("vehicleId");

    if (!vehicleId) {
      return NextResponse.json(
        { message: "Vehicle ID is required" },
        { status: 400 },
      );
    }

    const serviceLogs = await getServiceLogs(+vehicleId, user.userId);

    const formattedLogs = serviceLogs.map((log) => ({
      ...log,
      serviceType: ServiceLogDescription[log.serviceType],
    }));

    return NextResponse.json(formattedLogs);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
