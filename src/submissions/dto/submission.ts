import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  Length,
  ValidateNested,
} from 'class-validator';
import { MIN_LENGTH, MAX_LENGTH } from 'src/constants';
import {
  MultipleChoiceQuestionSubmissionInput,
  QuestionScore,
  QuestionSubmissionInput,
  QuizScore,
  QuizSubmissionInput,
  SingleChoiceQuestionSubmissionInput,
  SortingQuestionSubmissionInput,
  TextQuestionSubmissionInput,
} from 'src/graphql';

export class QuestionScoreDTO implements QuestionScore {
  questionID: string;
  obtained: number;
  maximum: number;
}

export class QuizScoreDTO implements QuizScore {
  totalObtained: number;
  totalMaximum: number;
  scores: QuestionScoreDTO[];
}

export class SingleChoiceQuestionSubmissionInputDTO
  implements SingleChoiceQuestionSubmissionInput
{
  @Length(MIN_LENGTH, MAX_LENGTH)
  answer: string;
}

export class MultipleChoiceQuestionSubmissionInputDTO
  implements MultipleChoiceQuestionSubmissionInput
{
  @IsArray()
  @ArrayNotEmpty()
  @Length(MIN_LENGTH, MAX_LENGTH, { each: true })
  answers: string[];
}

export class SortingQuestionSubmissionInputDTO
  implements SortingQuestionSubmissionInput
{
  @IsArray()
  @ArrayNotEmpty()
  @Length(MIN_LENGTH, MAX_LENGTH, { each: true })
  answers: string[];
}

export class TextQuestionSubmissionInputDTO
  implements TextQuestionSubmissionInput
{
  @Length(MIN_LENGTH, MAX_LENGTH)
  answer: string;
}

export class QuestionSubmissionInputDTO implements QuestionSubmissionInput {
  @IsNotEmpty()
  questionID: string;
  @IsOptional()
  @ValidateNested()
  singleChoiceQuestionSubmissionInput?: SingleChoiceQuestionSubmissionInputDTO;
  @IsOptional()
  @ValidateNested()
  multipleChoiceQuestionSubmissionInput?: MultipleChoiceQuestionSubmissionInputDTO;
  @IsOptional()
  @ValidateNested()
  sortingQuestionSubmissionInput?: SortingQuestionSubmissionInputDTO;
  @IsOptional()
  @ValidateNested()
  textQuestionSubmissionInput?: TextQuestionSubmissionInputDTO;
}

export class QuizSubmissionInputDTO implements QuizSubmissionInput {
  @IsNotEmpty()
  quizID: string;
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  submissions: QuestionSubmissionInputDTO[];
}
