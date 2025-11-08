import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "@/entities/user/user.entity";
import "reflect-metadata";

export abstract class OwnedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;

  @Column()
  userId: number;

  @UpdateDateColumn()
  lastUpdatedDate: Date;

  @CreateDateColumn()
  createdDate: Date;
}
