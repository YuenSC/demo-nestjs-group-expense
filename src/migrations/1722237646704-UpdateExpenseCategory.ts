import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateExpenseCategory1722237646704 implements MigrationInterface {
  name = 'UpdateExpenseCategory1722237646704';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "expense" ADD "category" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "category"`);
  }
}
