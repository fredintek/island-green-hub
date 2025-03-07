import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: true,
  })
  firstname: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: true,
  })
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    select: false,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EDITOR,
  })
  role: UserRole;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  resetToken?: string | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  resetTokenExpiration?: Date | null;

  @CreateDateColumn({
    select: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    select: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    select: false,
  })
  deletedAt: Date;
}
