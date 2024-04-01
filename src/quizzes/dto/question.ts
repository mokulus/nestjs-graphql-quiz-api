import {
  MultipleChoiceQuestionInput,
  Question,
  QuestionInput,
  SingleChoiceQuestion,
  SingleChoiceQuestionInput,
  SortingQuestionInput,
  TextQuestionInput,
} from '../../graphql';
import {
  IsInt,
  Length,
  IsOptional,
  ValidateNested,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { MIN_LENGTH, MAX_LENGTH } from './common';

export class QuestionDTO implements Question {
  @IsInt()
  id: string;

  @Length(MIN_LENGTH, MAX_LENGTH)
  prompt: string;
}

export class SingleChoiceQuestionInputDTO implements SingleChoiceQuestionInput {
  @Length(MIN_LENGTH, MAX_LENGTH)
  prompt: string;

  @Length(MIN_LENGTH, MAX_LENGTH, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  answers: string[];

  @Length(MIN_LENGTH, MAX_LENGTH)
  correctAnswer: string;
}

export class MultipleChoiceQuestionInputDTO
  implements MultipleChoiceQuestionInput
{
  @Length(MIN_LENGTH, MAX_LENGTH)
  prompt: string;

  @Length(MIN_LENGTH, MAX_LENGTH, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  answers: string[];

  @Length(MIN_LENGTH, MAX_LENGTH, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  correctAnswers: string[];
}

export class SortingQuestionInputDTO implements SortingQuestionInput {
  @Length(MIN_LENGTH, MAX_LENGTH)
  prompt: string;

  @Length(MIN_LENGTH, MAX_LENGTH, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  answers: string[];

  @Length(MIN_LENGTH, MAX_LENGTH, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  correctOrder: string[];
}

export class TextQuestionInputDTO implements TextQuestionInput {
  @Length(MIN_LENGTH, MAX_LENGTH)
  prompt: string;

  @Length(MIN_LENGTH, MAX_LENGTH)
  correctAnswer: string;
}

export class QuestionInputDTO implements QuestionInput {
  @IsOptional()
  @ValidateNested()
  singleChoiceQuestionInput?: SingleChoiceQuestionInputDTO;

  @IsOptional()
  @ValidateNested()
  multipleChoiceQuestionInput?: MultipleChoiceQuestionInputDTO;

  @IsOptional()
  @ValidateNested()
  sortingChoiceQuestionInput?: SortingQuestionInputDTO;

  @IsOptional()
  @ValidateNested()
  textQuestionInput?: TextQuestionInputDTO;
}

export class SingleChoiceQuestionDTO
  extends QuestionDTO
  implements SingleChoiceQuestion
{
  @Length(MIN_LENGTH, MAX_LENGTH, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  answers: string[];

  @Length(MIN_LENGTH, MAX_LENGTH)
  correctAnswer: string;

  static type = 'SingleChoiceQuestion';
}
