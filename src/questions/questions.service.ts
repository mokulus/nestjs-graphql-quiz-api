import { Injectable } from '@nestjs/common';
import {
  Question,
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  SortingQuestion,
  TextQuestion,
} from './entitites/question.entity';
import {
  MultipleChoiceQuestionInputDTO,
  QuestionInputDTO,
  SingleChoiceQuestionInputDTO,
  SortingQuestionInputDTO,
  TextQuestionInputDTO,
} from './dto/question';
import { QuestionInputVisitor } from './question.visitor';
import { QuestionInputValidationService } from './question.validation';

@Injectable()
export class QuestionsService {
  private readonly questionFactory = new QuestionFactory();
  constructor(
    private readonly questionInputValidationService: QuestionInputValidationService,
  ) {}

  makeEntity(questionInput: QuestionInputDTO): Question {
    this.questionInputValidationService.validate(questionInput);
    return this.questionFactory.visit(questionInput);
  }
}

class QuestionFactory extends QuestionInputVisitor<Question> {
  private makeQuestion<K extends keyof Question>(
    input: { prompt: string },
    ctor: new () => Question[K],
    key: K,
  ) {
    const { prompt, ...rest } = input;
    const question = new Question();
    question.prompt = prompt;
    question[key] = Object.assign(new ctor(), rest);
    return question;
  }

  visitSingleChoiceQuestionInput(
    input: SingleChoiceQuestionInputDTO,
  ): Question {
    return this.makeQuestion(
      input,
      SingleChoiceQuestion,
      'singleChoiceQuestion',
    );
  }

  visitMultipleChoiceQuestionInput(
    input: MultipleChoiceQuestionInputDTO,
  ): Question {
    return this.makeQuestion(
      input,
      MultipleChoiceQuestion,
      'multipleChoiceQuestion',
    );
  }

  visitSortingQuestionInput(input: SortingQuestionInputDTO): Question {
    return this.makeQuestion(input, SortingQuestion, 'sortingQuestion');
  }

  visitTextQuestionInput(input: TextQuestionInputDTO): Question {
    return this.makeQuestion(input, TextQuestion, 'textQuestion');
  }
}
