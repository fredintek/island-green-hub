import { Page } from 'src/page/page.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Section {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Page, (page) => page.sections, { onDelete: 'CASCADE' })
  page: Page;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  type: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  sortId: number;

  @Column({
    type: 'json',
    nullable: false,
  })
  content: any;
}
