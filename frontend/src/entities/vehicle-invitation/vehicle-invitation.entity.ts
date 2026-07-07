import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import "reflect-metadata";
import type { AccessLevel } from "@/entities/vehicle-access/vehicle-access.entity";

export type InvitationStatus = "PENDING" | "ACCEPTED" | "REVOKED";

@Entity("vehicle_invitation")
export class VehicleInvitation {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "vehicle_id" })
  vehicleId: number;

  // userId here is the inviter (owner of the vehicle)
  @Column({ name: "user_id" })
  userId: number;

  @Column({ name: "invitee_email" })
  inviteeEmail: string;

  @Column({ type: "varchar" })
  level: AccessLevel;

  @Column({ unique: true })
  token: string;

  @Column({ type: "varchar", default: "PENDING" })
  status: InvitationStatus;

  @Column({ name: "expires_at" })
  expiresAt: Date;

  @CreateDateColumn({ name: "created_at" })
  createdDate: Date;
}
