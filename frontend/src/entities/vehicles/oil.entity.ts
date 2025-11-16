import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Vehicle } from "./vehicle.entity";
import { OwnedEntity } from "@/entities/owned-entity";
import "reflect-metadata";
import { OilType } from "@/types/vehicles";

@Entity("oil")
export class Oil extends OwnedEntity {
  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  weight: string;

  @Column({ nullable: true, type: "varchar" })
  type?: OilType;

  @OneToOne(() => Vehicle, (vehicle) => vehicle.id, { nullable: false })
  @JoinColumn({ name: "vehicle_id", referencedColumnName: "id" })
  vehicleId: number;
}
