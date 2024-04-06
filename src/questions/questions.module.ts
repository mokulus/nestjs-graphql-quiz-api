import { Module } from '@nestjs/common';
import { QuestionsResolver } from './questions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Question,
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  SortingQuestion,
  TextQuestion,
} from './entitites/question.entity';
import { QuestionsService } from './questions.service';
import { QuestionConverterService } from './question.convert';
import { QuestionInputValidationService } from './question.validation';

@Module({
  providers: [
    QuestionsResolver,
    QuestionsService,
    QuestionConverterService,
    QuestionInputValidationService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      Question,
      SingleChoiceQuestion,
      MultipleChoiceQuestion,
      SortingQuestion,
      TextQuestion,
    ]),
  ],
  exports: [
    QuestionsService,
    QuestionConverterService,
    QuestionInputValidationService,
  ],
})
export class QuestionsModule {}
