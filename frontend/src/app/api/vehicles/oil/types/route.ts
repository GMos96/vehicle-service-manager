import { NextResponse } from "next/server";
import { OilType, OilTypeDescription } from "@/types/vehicles";

export async function GET(request: Request) {
  return NextResponse.json([
    {
      value: OilType.STANDARD,
      label: OilTypeDescription.STANDARD,
    },
    {
      value: OilType.SYNTHETIC,
      label: OilTypeDescription.SYNTHETIC,
    },
  ]);
}
