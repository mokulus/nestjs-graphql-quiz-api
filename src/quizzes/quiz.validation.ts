import { Injectable } from '@nestjs/common';
import { QuestionInputValidationService } from 'src/questions/question.validation';
import { CreateQuizInputDTO, UpdateQuizInputDTO } from './dto/quiz';

@Injectable()
export class QuizInputValidationService {
  constructor(
    private readonly questionInputValidatorService: QuestionInputValidationService,
  ) {}

  validate(value: CreateQuizInputDTO): CreateQuizInputDTO;
  validate(value: UpdateQuizInputDTO): UpdateQuizInputDTO;
  validate(
    value: CreateQuizInputDTO | UpdateQuizInputDTO,
  ): CreateQuizInputDTO | UpdateQuizInputDTO {
    if (value.questions != null) {
      for (const question of value.questions) {
        this.questionInputValidatorService.validate(question);
      }
    }
    return value;
  }
}
