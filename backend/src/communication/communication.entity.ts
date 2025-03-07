import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Communication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'json',
    nullable: false,
  })
  phoneNumber: string[];

  @Column({
    type: 'json',
    nullable: false,
  })
  email: string[];

  @Column({
    type: 'json',
    nullable: false,
  })
  address: string[];
}
