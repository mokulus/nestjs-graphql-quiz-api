import { CreateQuizInput } from './create-quiz.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateQuizInput extends PartialType(CreateQuizInput) {
  id: number;
}
