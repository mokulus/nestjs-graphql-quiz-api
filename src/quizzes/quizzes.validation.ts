import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateQuizInputDTO, UpdateQuizInputDTO } from './dto/quiz';
import {
  MultipleChoiceQuestionInputDTO,
  SingleChoiceQuestionInputDTO,
  SortingQuestionInputDTO,
  TextQuestionInputDTO,
} from './dto/question';
import { QuestionInputVisitor } from './question.visitor';

@Injectable()
export class QuizInputValidationService {
  private readonly questionInputValidator = new QuestionInputValidator();

  constructor() {}

  validate(value: CreateQuizInputDTO): CreateQuizInputDTO;
  validate(value: UpdateQuizInputDTO): UpdateQuizInputDTO;
  validate(
    value: CreateQuizInputDTO | UpdateQuizInputDTO,
  ): CreateQuizInputDTO | UpdateQuizInputDTO {
    if (value.questions !== null) {
      for (const question of value.questions) {
        this.questionInputValidator.visit(question);
      }
    }
    return value;
  }
}

class QuestionInputValidator extends QuestionInputVisitor<void> {
  visitSingleChoiceQuestionInput(value: SingleChoiceQuestionInputDTO) {
    const { answers, correctAnswer } = value;
    validateUnique(answers);
    if (!answers.includes(correctAnswer)) {
      throw new BadRequestException(
        'Validation failed - correct answer missing in asnwers',
      );
    }
  }
  visitMultipleChoiceQuestionInput(value: MultipleChoiceQuestionInputDTO) {
    const { answers, correctAnswers } = value;
    const answersSet = validateUnique(answers);
    validateUnique(correctAnswers);
    for (const correctAnswer of correctAnswers) {
      if (!answersSet.has(correctAnswer)) {
        throw new BadRequestException(
          `Validation failed - no ${correctAnswer} in answers`,
        );
      }
    }
  }
  visitSortingQuestionInput(value: SortingQuestionInputDTO) {
    const { answers, correctOrder } = value;
    const answersSet = validateUnique(answers);
    const correctSet = validateUnique(correctOrder);
    if (
      !(
        answersSet.size === correctSet.size &&
        [...answersSet].every((v) => correctSet.has(v))
      )
    ) {
      throw new BadRequestException(
        'Validation failed - answers sets are not equal',
      );
    }
  }
  visitTextQuestionInput(value: TextQuestionInputDTO) {
    value as any;
  }
}

function validateUnique<T>(array: T[]): Set<T> {
  const set = new Set(array);
  if (set.size !== array.length) {
    throw new BadRequestException(
      'Validation failed - duplicates are not allowed',
    );
  }
  return set;
}
