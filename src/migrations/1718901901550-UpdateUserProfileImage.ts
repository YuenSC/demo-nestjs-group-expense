import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserProfileImage1718901901550 implements MigrationInterface {
  name = 'UpdateUserProfileImage1718901901550';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "imageKey" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "imageKey"`);
  }
}
