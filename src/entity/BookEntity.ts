import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from './UserEntity';
import { UserBook } from './UserBookEntity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => UserBook, (userBook) => userBook.book)
  userBooks: UserBook[];
}