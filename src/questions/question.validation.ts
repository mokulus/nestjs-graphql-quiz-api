import { BadRequestException, Injectable } from '@nestjs/common';
import {
  MultipleChoiceQuestionInputDTO,
  QuestionInputDTO,
  SingleChoiceQuestionInputDTO,
  SortingQuestionInputDTO,
  TextQuestionInputDTO,
} from './dto/question';
import { QuestionInputVisitor } from './question.visitor';

@Injectable()
export class QuestionInputValidationService {
  private readonly questionInputValidator = new QuestionInputValidator();
  validate(questionInput: QuestionInputDTO) {
    if (
      Object.values(questionInput).filter((value) => value != null).length !== 1
    ) {
      throw new BadRequestException(
        'Validation failed - specify exactly one question input type',
      );
    }
    this.questionInputValidator.visit(questionInput);
  }
}

class QuestionInputValidator extends QuestionInputVisitor<void> {
  protected visitSingleChoiceQuestionInput(
    value: SingleChoiceQuestionInputDTO,
  ) {
    const { answers, correctAnswer } = value;
    validateUnique(answers);
    if (!answers.includes(correctAnswer)) {
      throw new BadRequestException(
        'Validation failed - correct answer missing in answers',
      );
    }
  }
  protected visitMultipleChoiceQuestionInput(
    value: MultipleChoiceQuestionInputDTO,
  ) {
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
  protected visitSortingQuestionInput(value: SortingQuestionInputDTO) {
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
  protected visitTextQuestionInput(value: TextQuestionInputDTO) {
    // No additional validation for text question
    value;
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
