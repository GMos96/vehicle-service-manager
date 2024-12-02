import { Column, Entity, OneToOne } from 'typeorm';
import { IsNotEmpty, Max, Min } from 'class-validator';
import { OwnedEntity } from '../../common/entity/owned-entity';
import { Oil } from './oil.entity';

@Entity()
export class Vehicle extends OwnedEntity {
  @Column()
  @Min(1900)
  @Max(9999)
  year: number;

  @Column({ length: 64 })
  @IsNotEmpty()
  make: string;

  @Column({ length: 64 })
  @IsNotEmpty()
  model: string;

  @Column({ length: 64 })
  trim: string;

  @Column()
  @Min(0)
  mileage: number;

  @OneToOne(() => Oil, (oil) => oil.vehicleId, { eager: true })
  oil?: Oil;
}
