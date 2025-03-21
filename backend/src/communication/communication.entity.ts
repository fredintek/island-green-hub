import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Communication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    type: 'longtext',
  })
  phoneNumber: string;

  @Column({
    type: 'longtext',
    nullable: true,
  })
  email: string;

  @Column({
    type: 'longtext',
    nullable: true,
  })
  address: string;
}
