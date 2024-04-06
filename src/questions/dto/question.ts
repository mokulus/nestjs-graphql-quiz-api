import {
  MultipleChoiceQuestion,
  MultipleChoiceQuestionInput,
  Question,
  QuestionInput,
  SingleChoiceQuestion,
  SingleChoiceQuestionInput,
  SortingQuestion,
  SortingQuestionInput,
  TextQuestion,
  TextQuestionInput,
} from '../../graphql';
import {
  Length,
  IsOptional,
  ValidateNested,
  IsArray,
  ArrayNotEmpty,
  Allow,
  IsNotEmpty,
} from 'class-validator';
import { MIN_LENGTH, MAX_LENGTH } from '../../constants';

export class QuestionDTO implements Question {
  @IsNotEmpty()
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

  @Allow()
  type = 'SingleChoiceQuestion';
}

export class MultipleChoiceQuestionDTO
  extends QuestionDTO
  implements MultipleChoiceQuestion
{
  @Length(MIN_LENGTH, MAX_LENGTH, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  answers: string[];

  @Length(MIN_LENGTH, MAX_LENGTH, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  correctAnswers: string[];

  @Allow()
  type = 'MultipleChoiceQuestion';
}

export class SortingQuestionDTO extends QuestionDTO implements SortingQuestion {
  @Length(MIN_LENGTH, MAX_LENGTH, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  answers: string[];

  @Length(MIN_LENGTH, MAX_LENGTH, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  correctOrder: string[];

  @Allow()
  type = 'SortingQuestion';
}

export class TextQuestionDTO extends QuestionDTO implements TextQuestion {
  @Length(MIN_LENGTH, MAX_LENGTH)
  correctAnswer: string;

  @Allow()
  type = 'TextQuestion';
}
