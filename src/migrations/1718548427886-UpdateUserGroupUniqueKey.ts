import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserGroupUniqueKey1718548427886
  implements MigrationInterface
{
  name = 'UpdateUserGroupUniqueKey1718548427886';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_group" ADD CONSTRAINT "UQ_d9a1801971c4c66927d77560e73" UNIQUE ("userId", "groupId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_group" DROP CONSTRAINT "UQ_d9a1801971c4c66927d77560e73"`,
    );
  }
}
