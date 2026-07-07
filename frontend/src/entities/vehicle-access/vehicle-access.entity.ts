import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import "reflect-metadata";

export type AccessLevel = "READ" | "WRITE";

@Entity("vehicle_access")
@Unique(["vehicleId", "userId"])
export class VehicleAccess {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "vehicle_id" })
  vehicleId: number;

  // userId here is the grantee (the user who has been given access)
  @Column({ name: "user_id" })
  userId: number;

  @Column({ type: "varchar" })
  level: AccessLevel;

  @CreateDateColumn({ name: "created_at" })
  createdDate: Date;
}
