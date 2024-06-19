import { MigrationInterface, QueryRunner } from 'typeorm';

export class CombineUserFirstNameAndLastName1718786247847
  implements MigrationInterface
{
  name = 'CombineUserFirstNameAndLastName1718786247847';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add the "name" column
    await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying`);

    // Populate the "name" column by concatenating "firstName" and "lastName"
    await queryRunner.query(
      `UPDATE "user" SET "name" = "firstName" || ' ' || "lastName"`,
    );

    // Drop the "firstName" and "lastName" columns
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstName"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastName"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add the "firstName" and "lastName" columns back
    await queryRunner.query(
      `ALTER TABLE "user" ADD "firstName" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "lastName" character varying NOT NULL DEFAULT ''`,
    );

    // Assuming the "name" column is split by the first space into "firstName" and "lastName"
    // This is a simplistic approach and may not accurately split all names
    await queryRunner.query(
      `UPDATE "user" SET "firstName" = split_part("name", ' ', 1), "lastName" = split_part("name", ' ', 2)`,
    );

    // Drop the "name" column
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
  }
}
