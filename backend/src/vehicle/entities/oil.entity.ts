import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { OwnedEntity } from '../../common/entity/owned-entity';
import { Vehicle } from './vehicle.entity';

@Entity()
export class Oil extends OwnedEntity {
  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  weight: string;

  @Column({ nullable: true })
  type: 'standard' | 'synthetic';

  @OneToOne(() => Vehicle, (vehicle) => vehicle.id)
  @JoinColumn({ name: 'vehicleId', referencedColumnName: 'id' })
  vehicleId: number;
}
