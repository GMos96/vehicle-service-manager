import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { OwnedEntity } from '../../common/entity/owned-entity';
import { Vehicle } from './vehicle.entity';

@Entity()
export class Tire extends OwnedEntity {
  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  size: string;

  @OneToOne(() => Vehicle, (vehicle) => vehicle.id)
  @JoinColumn({ name: 'vehicle_id', referencedColumnName: 'id' })
  vehicleId: number;
}
