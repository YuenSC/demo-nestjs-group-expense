import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserOtpSecret1721898854580 implements MigrationInterface {
  name = 'UpdateUserOtpSecret1721898854580';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_status_enum" AS ENUM('active', 'inactive')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "status" "public"."user_status_enum" NOT NULL DEFAULT 'inactive'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "otpSecret" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "otpSecret"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
  }
}
