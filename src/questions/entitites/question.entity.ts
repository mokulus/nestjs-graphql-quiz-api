import { Quiz } from '../../quizzes/entities/quiz.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'single_choice_question' })
export class SingleChoiceQuestion {
  @PrimaryGeneratedColumn({ name: 'single_choice_question_id' })
  id: number;

  @Column('text', { name: 'answers', array: true })
  answers: string[];

  @Column('text', { name: 'correct_answer' })
  correctAnswer: string;
}

@Entity({ name: 'multiple_choice_question' })
export class MultipleChoiceQuestion {
  @PrimaryGeneratedColumn({ name: 'multiple_choice_question_id' })
  id: number;

  @Column('text', { name: 'answers', array: true })
  answers: string[];

  @Column('text', { name: 'correct_answers', array: true })
  correctAnswers: string[];
}

@Entity({ name: 'sorting_question' })
export class SortingQuestion {
  @PrimaryGeneratedColumn({ name: 'sorting_question_id' })
  id: number;

  @Column('text', { name: 'answers', array: true })
  answers: string[];

  @Column('text', { name: 'correct_order', array: true })
  correctOrder: string[];
}

@Entity({ name: 'text_question' })
export class TextQuestion {
  @PrimaryGeneratedColumn({ name: 'text_question_id' })
  id: number;

  @Column({ name: 'correct_answer' })
  correctAnswer: string;
}

@Entity({ name: 'question' })
export class Question {
  @PrimaryGeneratedColumn({ name: 'question_id' })
  id: number;

  @Column({ name: 'prompt' })
  prompt: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions)
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  @OneToOne(() => SingleChoiceQuestion, { cascade: true })
  @JoinColumn({ name: 'single_choice_question_id' })
  singleChoiceQuestion: SingleChoiceQuestion;

  @OneToOne(() => MultipleChoiceQuestion, { cascade: true })
  @JoinColumn({ name: 'multiple_choice_question_id' })
  multipleChoiceQuestion: MultipleChoiceQuestion;

  @OneToOne(() => SortingQuestion, { cascade: true })
  @JoinColumn({ name: 'sorting_question_id' })
  sortingQuestion: SortingQuestion;

  @OneToOne(() => TextQuestion, { cascade: true })
  @JoinColumn({ name: 'text_question_id' })
  textQuestion: TextQuestion;
}
