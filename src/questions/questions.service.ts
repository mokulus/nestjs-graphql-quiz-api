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
  visitSingleChoiceQuestionInput(
    input: SingleChoiceQuestionInputDTO,
  ): Question {
    const { prompt, answers, correctAnswer } = input;
    const question = new Question();
    question.prompt = prompt;
    question.singleChoiceQuestion = Object.assign(new SingleChoiceQuestion(), {
      answers,
      correctAnswer,
    });
    return question;
  }

  visitMultipleChoiceQuestionInput(
    input: MultipleChoiceQuestionInputDTO,
  ): Question {
    const { prompt, answers, correctAnswers } = input;
    const question = new Question();
    question.prompt = prompt;
    question.multipleChoiceQuestion = Object.assign(
      new MultipleChoiceQuestion(),
      { answers, correctAnswers },
    );
    return question;
  }

  visitSortingQuestionInput(input: SortingQuestionInputDTO): Question {
    const { prompt, answers, correctOrder } = input;
    const question = new Question();
    question.prompt = prompt;
    question.sortingQuestion = Object.assign(new SortingQuestion(), {
      answers,
      correctOrder,
    });
    return question;
  }

  visitTextQuestionInput(input: TextQuestionInputDTO): Question {
    const { prompt, correctAnswer } = input;
    const question = new Question();
    question.prompt = prompt;
    question.textQuestion = Object.assign(new TextQuestion(), {
      correctAnswer,
    });
    return question;
  }
}
