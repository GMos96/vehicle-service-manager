import { NextResponse } from "next/server";
import { getUserFromToken } from "@/core/auth";
import { isValidVinFormat } from "@/util/vin";
import { decodeVin, NhtsaUnavailableError } from "@/app/api/vehicles/nhtsa.service";

export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const vin = new URL(request.url).searchParams.get("vin") ?? "";
    if (!isValidVinFormat(vin)) {
      return NextResponse.json(
        {
          message: [{ property: "vin", message: "Invalid VIN format" }],
          status: 400,
        },
        { status: 400 },
      );
    }

    const decoded = await decodeVin(vin.trim());
    return NextResponse.json(decoded);
  } catch (error) {
    if (error instanceof NhtsaUnavailableError) {
      return NextResponse.json(
        { message: "VIN decode service is temporarily unavailable" },
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
