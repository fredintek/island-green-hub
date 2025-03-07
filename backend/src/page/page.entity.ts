import { ProjectHouse } from 'src/project-house/project-house.entity';
import { Section } from 'src/section/section.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import slugify from 'slugify';

@Entity()
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'json',
    nullable: false,
  })
  title: {
    en: string;
    ru: string;
    tr: string;
  };

  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @ManyToOne(() => Page, (parentPage) => parentPage.subPages, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parentPage: Page;

  @OneToMany(() => Page, (subPages) => subPages.parentPage)
  subPages: Page[];

  @OneToMany(() => Section, (section) => section.page, { cascade: true })
  sections: Section[];

  @OneToMany(() => ProjectHouse, (projectHouse) => projectHouse.projectPage)
  projectHouse: ProjectHouse[];

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.title?.en) {
      this.slug = slugify(this.title.en, { lower: true, trim: true });
    }
  }
}
