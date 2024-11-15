import { Column, Entity } from 'typeorm';
import { IsNotEmpty, Max, Min } from 'class-validator';
import { OwnedEntity } from '../../common/entity/owned-entity';

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
}
