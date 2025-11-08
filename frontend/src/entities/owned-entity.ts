import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import "reflect-metadata";

export abstract class OwnedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id" })
  userId: number;

  @UpdateDateColumn({ name: "updated_at" })
  lastUpdatedDate: Date;

  @CreateDateColumn({ name: "created_at" })
  createdDate: Date;
}
