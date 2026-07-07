import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVehicleSharing1783379400000 implements MigrationInterface {
  name = "AddVehicleSharing1783379400000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "vehicle_access" (
        "id" SERIAL PRIMARY KEY,
        "vehicle_id" integer NOT NULL,
        "user_id" integer NOT NULL,
        "level" varchar NOT NULL DEFAULT 'READ',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_vehicle_access_vehicle_user" UNIQUE ("vehicle_id", "user_id"),
        CONSTRAINT "FK_vehicle_access_vehicle" FOREIGN KEY ("vehicle_id")
          REFERENCES "vehicle"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "vehicle_invitation" (
        "id" SERIAL PRIMARY KEY,
        "vehicle_id" integer NOT NULL,
        "user_id" integer NOT NULL,
        "invitee_email" varchar NOT NULL,
        "level" varchar NOT NULL DEFAULT 'READ',
        "token" varchar UNIQUE NOT NULL,
        "status" varchar NOT NULL DEFAULT 'PENDING',
        "expires_at" TIMESTAMP NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_vehicle_invitation_vehicle" FOREIGN KEY ("vehicle_id")
          REFERENCES "vehicle"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "vehicle_invitation"`);
    await queryRunner.query(`DROP TABLE "vehicle_access"`);
  }
}
