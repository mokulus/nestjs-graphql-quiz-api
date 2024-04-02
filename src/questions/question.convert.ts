import { Injectable } from '@nestjs/common';
import {
  MultipleChoiceQuestionDTO,
  QuestionDTO,
  SingleChoiceQuestionDTO,
  SortingQuestionDTO,
  TextQuestionDTO,
} from './dto/question';
import { QuestionEntityVisitor } from './question.visitor';
import {
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  SortingQuestion,
  TextQuestion,
} from './entitites/question.entity';

@Injectable()
export class QuestionConverterService extends QuestionEntityVisitor<QuestionDTO> {
  visitSingleChoiceQuestionEntity(
    singleChoiceQuestion: SingleChoiceQuestion,
  ): QuestionDTO {
    const { id, answers, correctAnswer } = singleChoiceQuestion;
    return Object.assign(new SingleChoiceQuestionDTO(), {
      id,
      answers,
      correctAnswer,
    });
  }
  visitMultipleChoiceQuestionEntity(
    multipleChoiceQuestion: MultipleChoiceQuestion,
  ): QuestionDTO {
    const { id, answers, correctAnswers } = multipleChoiceQuestion;
    return Object.assign(new MultipleChoiceQuestionDTO(), {
      id,
      answers,
      correctAnswers,
    });
  }
  visitSortingQuestion(sortingQuestion: SortingQuestion): QuestionDTO {
    const { id, answers, correctOrder } = sortingQuestion;
    return Object.assign(new SortingQuestionDTO(), {
      id,
      answers,
      correctOrder,
    });
  }
  visitTextQuestion(textQuestion: TextQuestion): QuestionDTO {
    const { id, correctAnswer } = textQuestion;
    return Object.assign(new TextQuestionDTO(), {
      id,
      correctAnswer,
    });
  }
}
