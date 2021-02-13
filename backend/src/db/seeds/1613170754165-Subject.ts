import { MigrationInterface, QueryRunner } from 'typeorm';

export class Subject1613170754165 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const subjects = [
      'Anatomy',
      'Charecter Design',
      'Environment',
      'Concept Art',
      'Scetch',
      'Fan Art',
      'Graphic Design',
      'Portrait',
      'Prop & Clothe',
      'Texture & Material',
      'Web and App Design',
      'Other',
    ];
    let values = '';
    subjects.forEach((subject) => {
      values += `('${subject}'),`;
    });

    await queryRunner.query(`INSERT INTO subject(value) VALUES ${values.slice(0, -1)}`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM subject');
  }
}
