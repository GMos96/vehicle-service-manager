// frontend/src/entities/user/user.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsEmail, IsNotEmpty } from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column()
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail(undefined, {
    message: "Email address must be a valid email address",
  })
  emailAddress: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({ default: true })
  isActive: boolean;
}
