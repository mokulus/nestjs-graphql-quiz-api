import { QuestionInputValidationService } from './question.validation';
import {
  QuestionInputDTO,
  SingleChoiceQuestionInputDTO,
  SortingQuestionInputDTO,
  TextQuestionInputDTO,
} from './dto/question';
import { MultipleChoiceQuestion } from '../graphql';

describe('QuestionInputValidationService', () => {
  let questionInputValidationService: QuestionInputValidationService;

  beforeEach(async () => {
    questionInputValidationService = new QuestionInputValidationService();
  });

  it('should be defined', () => {
    expect(questionInputValidationService).toBeDefined();
  });

  describe('validate', () => {
    it('should allow exactly one input type', () => {
      const question = new QuestionInputDTO();
      expect(() => questionInputValidationService.validate(question)).toThrow(
        'exactly one question input',
      );
      question.singleChoiceQuestionInput = makeSingleChoice();
      expect(() =>
        questionInputValidationService.validate(question),
      ).not.toThrow();
      question.multipleChoiceQuestionInput = makeMultipleChoice();
      expect(() => questionInputValidationService.validate(question)).toThrow(
        'exactly one question input',
      );
    });

    describe('single choice question validation', () => {
      it('should throw if answers are not unique', () => {
        const question = new QuestionInputDTO();
        const single = makeSingleChoice();
        question.singleChoiceQuestionInput = single;
        single.correctAnswer = 'A';
        single.answers = ['A', 'A', 'B', 'C'];
        expect(() => questionInputValidationService.validate(question)).toThrow(
          'duplicates are not allowed',
        );
        single.answers = ['A', 'B', 'C'];
      });
      it('should throw if correct answer is missing', () => {
        const question = new QuestionInputDTO();
        const single = makeSingleChoice();
        question.singleChoiceQuestionInput = single;
        single.correctAnswer = 'D';
        single.answers = ['A', 'B', 'C'];
        expect(() => questionInputValidationService.validate(question)).toThrow(
          'correct answer missing',
        );
      });
    });

    describe('multiple choice question validation', () => {
      it('should throw if answers are not unique', () => {
        const question = new QuestionInputDTO();
        const multiple = makeMultipleChoice();
        question.multipleChoiceQuestionInput = multiple;
        multiple.correctAnswers = ['A', 'B'];
        multiple.answers = ['A', 'A', 'B', 'C'];
        expect(() => questionInputValidationService.validate(question)).toThrow(
          'duplicates are not allowed',
        );
      });
      it('should throw if correct answers are not unique', () => {
        const question = new QuestionInputDTO();
        const multiple = makeMultipleChoice();
        question.multipleChoiceQuestionInput = multiple;
        multiple.correctAnswers = ['A', 'A'];
        multiple.answers = ['A', 'B', 'C'];
        expect(() => questionInputValidationService.validate(question)).toThrow(
          'duplicates are not allowed',
        );
      });
      it('should throw if any correct answer is missing', () => {
        const question = new QuestionInputDTO();
        const multiple = makeMultipleChoice();
        question.multipleChoiceQuestionInput = multiple;
        multiple.correctAnswers = ['B', 'E', 'A'];
        multiple.answers = ['A', 'B', 'C', 'D'];
        expect(() => questionInputValidationService.validate(question)).toThrow(
          'no E in answers',
        );
      });
    });

    describe('sorting question validation', () => {
      it('should throw if answers or correct answers are not unique', () => {
        const question = new QuestionInputDTO();
        const sorting = makeSorting();
        question.sortingQuestionInput = sorting;
        sorting.correctOrder = ['A', 'B', 'B'];
        sorting.answers = ['A', 'B', 'B'];
        expect(() => questionInputValidationService.validate(question)).toThrow(
          'duplicates are not allowed',
        );
      });
      it('should throw if answers set is not equal to correct answers set', () => {
        const question = new QuestionInputDTO();
        const sorting = makeSorting();
        question.sortingQuestionInput = sorting;
        sorting.correctOrder = ['A', 'B', 'D'];
        sorting.answers = ['A', 'B', 'C'];
        expect(() => questionInputValidationService.validate(question)).toThrow(
          'sets are not equal',
        );
      });
    });
    describe('text question validation', () => {
      it('should allow any text', () => {
        const question = new QuestionInputDTO();
        const text = makeText();
        question.textQuestionInput = text;
        text.correctAnswer = 'any';
        expect(() =>
          questionInputValidationService.validate(question),
        ).not.toThrow();
      });
    });
  });
});

function makeSingleChoice() {
  const single = new SingleChoiceQuestionInputDTO();
  single.prompt = 'prompt';
  single.answers = ['A', 'B', 'C'];
  single.correctAnswer = single.answers[0];
  return single;
}

function makeMultipleChoice() {
  const multiple = new MultipleChoiceQuestion();
  multiple.prompt = 'prompt';
  multiple.answers = ['A', 'B', 'C'];
  multiple.correctAnswers = ['A', 'C'];
  return multiple;
}

function makeSorting() {
  const sorting = new SortingQuestionInputDTO();
  sorting.prompt = 'prompt';
  sorting.answers = ['A', 'B', 'C'];
  sorting.correctOrder = ['B', 'C', 'A'];
  return sorting;
}

function makeText() {
  const text = new TextQuestionInputDTO();
  text.prompt = 'prompt';
  text.correctAnswer = 'answer';
  return text;
}
