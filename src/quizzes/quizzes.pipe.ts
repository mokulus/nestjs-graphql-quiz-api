import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateQuizInputDTO } from './dto/quiz';
import {
  MultipleChoiceQuestionInputDTO,
  SingleChoiceQuestionInputDTO,
  SortingQuestionInputDTO,
  TextQuestionInputDTO,
} from './dto/question';

@Injectable()
export class ValidateCreateQuizInputPipe
  implements PipeTransform<CreateQuizInputDTO>
{
  transform(value: CreateQuizInputDTO, metadata: ArgumentMetadata) {
    metadata as any;
    for (const question of value.questions) {
      if (question.singleChoiceQuestionInput !== null) {
        validateSingleChoiceQuestion(question.singleChoiceQuestionInput);
      } else if (question.multipleChoiceQuestionInput !== null) {
        validateMultipleChoiceQuestion(question.multipleChoiceQuestionInput);
      } else if (question.sortingChoiceQuestionInput !== null) {
        validateSortingChoiceQuestion(question.sortingChoiceQuestionInput);
      } else if (question.textQuestionInput !== null) {
        validateTextQuestionInput(question.textQuestionInput);
      } else {
        throw new BadRequestException(
          'Validation failed - all question inputs are empty',
        );
      }
    }
    return value;
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

function validateSingleChoiceQuestion(value: SingleChoiceQuestionInputDTO) {
  const { answers, correctAnswer } = value;
  validateUnique(answers);
  if (!answers.includes(correctAnswer)) {
    throw new BadRequestException(
      'Validation failed - correct answer missing in asnwers',
    );
  }
}

function validateMultipleChoiceQuestion(value: MultipleChoiceQuestionInputDTO) {
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

function validateSortingChoiceQuestion(value: SortingQuestionInputDTO) {
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

function validateTextQuestionInput(value: TextQuestionInputDTO) {
  value as any;
}
