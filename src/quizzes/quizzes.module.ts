import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesResolver } from './quizzes.resolver';
import { QuestionsResolver } from './questions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Quiz } from './entities/quiz.entity';
import {
  MultipleChoiceQuestion,
  SingleChoiceQuestion,
  SortingQuestion,
  TextQuestion,
} from './entities/question.entity';

@Module({
  providers: [QuizzesResolver, QuestionsResolver, QuizzesService],
  imports: [
    TypeOrmModule.forFeature([
      Quiz,
      Question,
      SingleChoiceQuestion,
      MultipleChoiceQuestion,
      SortingQuestion,
      TextQuestion,
    ]),
  ],
})
export class QuizzesModule {}
