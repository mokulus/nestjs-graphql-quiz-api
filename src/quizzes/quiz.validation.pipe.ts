import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { QuestionInputValidationService } from 'src/questions/question.validation';
import { CreateQuizInputDTO, UpdateQuizInputDTO } from './dto/quiz';

@Injectable()
export class QuizInputValidationPipe
  implements
    PipeTransform<CreateQuizInputDTO>,
    PipeTransform<UpdateQuizInputDTO>
{
  constructor(
    private readonly questionInputValidatorService: QuestionInputValidationService,
  ) {}

  transform(
    value: UpdateQuizInputDTO,
    metadata: ArgumentMetadata,
  ): UpdateQuizInputDTO;
  transform(
    value: CreateQuizInputDTO,
    metadata: ArgumentMetadata,
  ): CreateQuizInputDTO;
  transform(
    value: UpdateQuizInputDTO | CreateQuizInputDTO,
    metadata: ArgumentMetadata,
  ) {
    metadata as any;
    if (value.questions != null) {
      for (const question of value.questions) {
        this.questionInputValidatorService.validate(question);
      }
    }
    return value;
  }
}
