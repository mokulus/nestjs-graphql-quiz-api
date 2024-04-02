import { Quiz, UpdateQuizInput, CreateQuizInput } from '../../graphql';
import {
  IsInt,
  Length,
  ValidateNested,
  IsOptional,
  IsArray,
} from 'class-validator';
import { QuestionDTO, QuestionInputDTO } from '../../questions/dto/question';
import { MIN_LENGTH, MAX_LENGTH } from '../../constants';

export class QuizDTO implements Quiz {
  @IsInt()
  id: string;
  @Length(MIN_LENGTH, MAX_LENGTH)
  name: string;
  @ValidateNested()
  questions: QuestionDTO[];
}
export class CreateQuizInputDTO implements CreateQuizInput {
  @Length(MIN_LENGTH, MAX_LENGTH)
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  questions: QuestionInputDTO[];
}
export class UpdateQuizInputDTO implements UpdateQuizInput {
  @IsInt()
  id: string;

  @Length(MIN_LENGTH, MAX_LENGTH)
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  questions?: QuestionInputDTO[];
}
