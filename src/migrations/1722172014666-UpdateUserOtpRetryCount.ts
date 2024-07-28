import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserOtpRetryCount1722172014666
  implements MigrationInterface
{
  name = 'UpdateUserOtpRetryCount1722172014666';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "otpRetryChanceLeft" integer DEFAULT '5'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "otpRetryChanceLeft"`,
    );
  }
}
