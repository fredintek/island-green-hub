import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Faq {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'json',
    nullable: false,
  })
  question: {
    en: string;
    tr: string;
    ru: string;
  };

  @Column({
    type: 'json',
    nullable: false,
  })
  answer: {
    en: string;
    tr: string;
    ru: string;
  };
}
