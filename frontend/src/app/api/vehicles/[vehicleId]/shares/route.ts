import { NextResponse } from "next/server";
import crypto from "crypto";
import { getUserFromToken } from "@/core/auth";
import { findOneVehicle } from "../../vehicle.service";
import { getDataSource } from "@/core/datasource/data-source";
import { VehicleAccess } from "@/entities/vehicle-access/vehicle-access.entity";
import { VehicleInvitation } from "@/entities/vehicle-invitation/vehicle-invitation.entity";
import { VehicleParams } from "@/app/api/vehicles/types";
import { sendEmail } from "@/core/email/email.service";

function inviteUrl(origin: string, token: string) {
  return `${origin}/invitations/${token}`;
}

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

    const ds = await getDataSource();
    const origin = new URL(request.url).origin;

    const [shares, invitations] = await Promise.all([
      ds.getRepository(VehicleAccess).findBy({ vehicleId: +vehicleId }),
      ds.getRepository(VehicleInvitation).findBy({ vehicleId: +vehicleId }),
    ]);

    return NextResponse.json({
      shares,
      invitations: invitations.map((inv) => ({
        ...inv,
        inviteUrl: inviteUrl(origin, inv.token),
      })),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: VehicleParams) {
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

    const body = await request.json();
    const { inviteeEmail, level = "READ" } = body;

    if (!inviteeEmail || typeof inviteeEmail !== "string") {
      return NextResponse.json({ message: "inviteeEmail is required" }, { status: 400 });
    }
    if (level !== "READ" && level !== "WRITE") {
      return NextResponse.json({ message: "level must be READ or WRITE" }, { status: 400 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const ds = await getDataSource();
    const inv = await ds.getRepository(VehicleInvitation).save({
      vehicleId: +vehicleId,
      userId: user.userId,
      inviteeEmail,
      level,
      token,
      status: "PENDING",
      expiresAt,
    });

    const origin = new URL(request.url).origin;
    const url = inviteUrl(origin, token);

    await sendEmail({
      to: inviteeEmail,
      subject: `You've been invited to view a vehicle`,
      text: `You have been invited to access a vehicle.\n\nAccept the invitation here:\n${url}\n\nThis link expires in 7 days.`,
    });

    return NextResponse.json({ ...inv, inviteUrl: url }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
