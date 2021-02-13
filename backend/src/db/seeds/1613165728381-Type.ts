import { MigrationInterface, QueryRunner } from 'typeorm';

export class Type1613165728381 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const types = ['2D', '3D', 'Live Action CG/VFX', 'Traditional'];
    let values = '';
    types.forEach((type) => {
      values += `('${type}'),`;
    });

    await queryRunner.query(`INSERT INTO type(value) VALUES ${values.slice(0, -1)}`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM type');
  }
}
