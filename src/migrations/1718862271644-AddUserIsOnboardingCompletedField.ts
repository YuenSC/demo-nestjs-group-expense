import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserIsOnboardingCompletedField1718862271644
  implements MigrationInterface
{
  name = 'AddUserIsOnboardingCompletedField1718862271644';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isOnboardingCompleted" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isOnboardingCompleted"`,
    );
  }
}
