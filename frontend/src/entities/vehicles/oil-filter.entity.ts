import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Vehicle } from "./vehicle.entity";
import { OwnedEntity } from "@/entities/owned-entity";

@Entity("oil_filter")
export class OilFilter extends OwnedEntity {
  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  model: string;

  @OneToOne(() => Vehicle, (vehicle) => vehicle.id)
  @JoinColumn({ name: "vehicle_id", referencedColumnName: "id" })
  vehicleId: number;
}
