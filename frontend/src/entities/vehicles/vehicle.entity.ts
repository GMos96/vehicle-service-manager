import { Column, Entity, OneToOne } from "typeorm";
import { Max, Min } from "class-validator";
import { Oil } from "./oil.entity";
import { OilFilter } from "./oil-filter.entity";
import { Tire } from "./tire.entity";
import { OwnedEntity } from "@/entities/owned-entity";
import "reflect-metadata";

@Entity("user")
export class Vehicle extends OwnedEntity {
  @Column()
  @Min(1900)
  @Max(9999)
  year: number;

  @Column({ length: 64 })
  make: string;

  @Column({ length: 64 })
  model: string;

  @Column({ length: 64 })
  trim: string;

  @Column()
  @Min(0)
  mileage: number;

  @OneToOne(() => Oil, (oil) => oil.vehicleId, { eager: true })
  oil?: Oil;

  @OneToOne(() => OilFilter, (oil) => oil.vehicleId, { eager: true })
  oilFilter?: OilFilter;

  @OneToOne(() => Tire, (tire) => tire.vehicleId, { eager: true })
  tire?: Tire;
}
