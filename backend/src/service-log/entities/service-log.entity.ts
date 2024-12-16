import { OwnedEntity } from '../../common/entity/owned-entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  ValidateIf,
} from 'class-validator';

export enum ServiceLogType {
  OIL_CHANGE = 'OIL_CHANGE',
  TIRE_ROTATION = 'TIRE_ROTATION',
  OTHER = 'OTHER',
}

export const ServiceLogDescription = {
  OIL_CHANGE: 'Oil Change',
  TIRE_ROTATION: 'Tire Rotation',
  OTHER: 'Other',
};

@Entity()
export class ServiceLog extends OwnedEntity {
  @Column({ nullable: true })
  @IsNumber()
  mileage?: number;

  @Column({ enum: ServiceLogType, nullable: false })
  @IsEnum(ServiceLogType)
  serviceType: ServiceLogType;

  @Column({ nullable: false })
  @IsNotEmpty()
  description: string;

  @Column({ default: 0 })
  repairCost: number;

  @Column({ nullable: false, type: 'date' })
  @ValidateIf((object) => object.serviceDate)
  @IsDate({})
  serviceDate: Date;

  @OneToOne(() => Vehicle, (vehicle) => vehicle.id)
  @IsNotEmpty()
  @IsNumber()
  vehicleId: number;
}
