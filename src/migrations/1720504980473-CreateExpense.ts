import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExpense1720504980473 implements MigrationInterface {
  name = 'CreateExpense1720504980473';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "expense" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "amount" integer NOT NULL, "incurredOn" TIMESTAMP NOT NULL, "groupId" uuid, CONSTRAINT "PK_edd925b450e13ea36197c9590fc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."expense_transaction_type_enum" AS ENUM('payer', 'payee')`,
    );
    await queryRunner.query(
      `CREATE TABLE "expense_transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "type" "public"."expense_transaction_type_enum" NOT NULL DEFAULT 'payee', "amount" numeric(10,2), "isAutoSplit" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "expenseId" uuid, CONSTRAINT "PK_69f83886394c3078d274375eba8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "expense" ADD CONSTRAINT "FK_3e5276c441c4db9113773113136" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "expense_transaction" ADD CONSTRAINT "FK_68b03e273458bf3510624a9f93b" FOREIGN KEY ("expenseId") REFERENCES "expense"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "expense_transaction" ADD CONSTRAINT "FK_d9e487f66ff27e48457dcae066b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "expense_transaction" DROP CONSTRAINT "FK_d9e487f66ff27e48457dcae066b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expense_transaction" DROP CONSTRAINT "FK_68b03e273458bf3510624a9f93b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expense" DROP CONSTRAINT "FK_3e5276c441c4db9113773113136"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "expense_transaction"`);
    await queryRunner.query(
      `DROP TYPE "public"."expense_transaction_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "expense"`);
  }
}
