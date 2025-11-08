// frontend/src/entities/user/user.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsEmail, IsNotEmpty } from "class-validator";
import "reflect-metadata";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, name: "first_name" })
  firstName?: string;

  @Column({ nullable: true, name: "last_name" })
  lastName?: string;

  @Column({ name: "email_address", unique: true })
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail(undefined, {
    message: "Email address must be a valid email address",
  })
  emailAddress: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({ default: true, name: "is_active" })
  isActive: boolean;
}
