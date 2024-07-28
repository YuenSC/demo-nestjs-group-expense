import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAmountType1722170376096 implements MigrationInterface {
  name = 'UpdateAmountType1722170376096';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "amount"`);
    await queryRunner.query(
      `ALTER TABLE "expense" ADD "amount" numeric(10,2) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "amount"`);
    await queryRunner.query(
      `ALTER TABLE "expense" ADD "amount" integer NOT NULL`,
    );
  }
}
