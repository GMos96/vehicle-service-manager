import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  ValidateIf,
} from "class-validator";
import { OwnedEntity } from "@/entities/owned-entity";
import { Vehicle } from "@/entities/vehicles/vehicle.entity";
import { ServiceLogType } from "@/types/service-logs";
import "reflect-metadata";

@Entity("service_log")
export class ServiceLog extends OwnedEntity {
  @Column({ nullable: true })
  @IsNumber()
  mileage?: number;

  @Column({ type: "varchar", nullable: false, name: "service_type" })
  @IsEnum(ServiceLogType)
  serviceType: ServiceLogType;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0, name: "repair_cost" })
  repairCost: number = 0;

  @Column({ nullable: false, type: "date" })
  @ValidateIf((object) => object.serviceDate)
  @IsDate({})
  serviceDate: Date;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.id)
  @JoinColumn({ name: "vehicle_id", referencedColumnName: "id" })
  @IsNotEmpty()
  @IsNumber()
  vehicleId: number;
}
