import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from './UserEntity';
import { Book } from './BookEntity';

@Entity()
export class UserBook {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userBooks)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Book, (book) => book.userBooks)
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @Column({ type: 'smallint', nullable: true })
  score: string;
}
