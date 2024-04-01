import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Quiz } from './quiz.entity';

@Entity()
export class SingleChoiceQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-array')
  answers: string[];

  @Column()
  correctAnswer: string;
}

@Entity()
export class MultipleChoiceQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-array')
  answers: string[];

  @Column('simple-array')
  correctAnswers: string[];
}

@Entity()
export class SortingQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-array')
  answers: string[];

  @Column('simple-array')
  correctOrder: string[];
}

@Entity()
export class TextQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  correctAnswer: string;
}

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  prompt: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions)
  quiz: Quiz;

  @OneToOne(() => SingleChoiceQuestion, { nullable: true, cascade: true })
  @JoinColumn()
  singleChoiceQuestion: SingleChoiceQuestion;

  @OneToOne(() => MultipleChoiceQuestion, { nullable: true, cascade: true })
  @JoinColumn()
  multipleChoiceQuestion: MultipleChoiceQuestion;

  @OneToOne(() => SortingQuestion, { nullable: true, cascade: true })
  @JoinColumn()
  sortingQuestion: SortingQuestion;

  @OneToOne(() => TextQuestion, { nullable: true, cascade: true })
  @JoinColumn()
  textQuestion: TextQuestion;
}
