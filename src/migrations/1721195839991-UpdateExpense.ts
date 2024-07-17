import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateExpense1721195839991 implements MigrationInterface {
    name = 'UpdateExpense1721195839991'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "expense" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense" ADD "currencyCode" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "currencyCode"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "expense" ADD "name" character varying NOT NULL`);
    }

}
