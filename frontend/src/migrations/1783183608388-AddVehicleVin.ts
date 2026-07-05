import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVehicleVin1783183608388 implements MigrationInterface {
  name = "AddVehicleVin1783183608388";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vehicle" ADD "vin" character varying(17)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_1aa11abdc43ac3aacebc14e261" ON "vehicle" ("user_id", "vin") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1aa11abdc43ac3aacebc14e261"`,
    );
    await queryRunner.query(`ALTER TABLE "vehicle" DROP COLUMN "vin"`);
  }
}
