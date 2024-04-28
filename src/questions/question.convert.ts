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
  Question,
} from './entitites/question.entity';

@Injectable()
export class QuestionConverterService {
  private readonly questionEntityConverterVisitor =
    new QuestionEntityConverterVisitor();

  convert(questionEntity: Question): QuestionDTO {
    return this.questionEntityConverterVisitor.visit(questionEntity);
  }
}

class QuestionEntityConverterVisitor extends QuestionEntityVisitor<QuestionDTO> {
  visitSingleChoiceQuestionEntity(
    singleChoiceQuestion: SingleChoiceQuestion,
  ): QuestionDTO {
    const { answers, correctAnswer } = singleChoiceQuestion;
    return Object.assign(new SingleChoiceQuestionDTO(), {
      answers,
      correctAnswer,
    });
  }
  visitMultipleChoiceQuestionEntity(
    multipleChoiceQuestion: MultipleChoiceQuestion,
  ): QuestionDTO {
    const { answers, correctAnswers } = multipleChoiceQuestion;
    return Object.assign(new MultipleChoiceQuestionDTO(), {
      answers,
      correctAnswers,
    });
  }
  visitSortingQuestion(sortingQuestion: SortingQuestion): QuestionDTO {
    const { answers, correctOrder } = sortingQuestion;
    return Object.assign(new SortingQuestionDTO(), {
      answers,
      correctOrder,
    });
  }
  visitTextQuestion(textQuestion: TextQuestion): QuestionDTO {
    const { correctAnswer } = textQuestion;
    return Object.assign(new TextQuestionDTO(), {
      correctAnswer,
    });
  }
}
