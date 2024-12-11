import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Entity()
@Unique(['emailAddress'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({ default: true })
  isActive: boolean;
}
