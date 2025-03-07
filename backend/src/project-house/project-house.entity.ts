import slugify from 'slugify';
import { Page } from 'src/page/page.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class ProjectHouse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Page, (page) => page.projectHouse, { onDelete: 'CASCADE' })
  projectPage: Page;

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

  @Column({
    type: 'json',
    nullable: false,
  })
  coverImage: {
    publicId: string;
    url: string;
  };

  @Column({
    type: 'json',
    nullable: false,
  })
  displayImage: {
    publicId: string;
    url: string;
  };

  @Column({
    type: 'json',
    nullable: false,
  })
  generalInfo: {
    en: string;
    ru: string;
    tr: string;
  };

  @Column({
    type: 'json',
    nullable: true,
  })
  features: {
    en: string;
    ru: string;
    tr: string;
  };

  @Column({
    type: 'json',
    nullable: true,
  })
  optionalFeatures: {
    en: string;
    ru: string;
    tr: string;
  };

  @Column({ type: 'json', nullable: true })
  gallery: {
    imageUrl: {
      publicId: string;
      url: string;
    };
    tag?: string;
  }[];

  @Column({
    type: 'json',
    nullable: true,
  })
  homeText: {
    en: string;
    ru: string;
    tr: string;
  };

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isHomePage: boolean;

  @Column({
    type: 'json',
    nullable: true,
  })
  homeImages: {
    publicId: string;
    url: string;
  }[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.title?.en) {
      this.slug = slugify(this.title.en, { lower: true, trim: true });
    }
  }
}
