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
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail(undefined, {
    message: 'Email address must be a valid email address',
  })
  emailAddress: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({ default: true })
  isActive: boolean;
}
