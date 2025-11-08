import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Vehicle } from "./vehicle.entity";
import { OwnedEntity } from "@/entities/owned-entity";
import "reflect-metadata";

@Entity("oil")
export class Oil extends OwnedEntity {
  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  weight: string;

  @Column({ nullable: true })
  type: "standard" | "synthetic";

  @OneToOne(() => Vehicle, (vehicle) => vehicle.id, { nullable: false })
  @JoinColumn({ name: "vehicle_id", referencedColumnName: "id" })
  vehicleId: number;
}
