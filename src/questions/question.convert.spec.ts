import { QuestionConverterService } from './question.convert';
import {
  MultipleChoiceQuestion,
  Question,
  SingleChoiceQuestion,
  SortingQuestion,
  TextQuestion,
} from './entitites/question.entity';
import {
  MultipleChoiceQuestionDTO,
  SingleChoiceQuestionDTO,
  SortingQuestionDTO,
  TextQuestionDTO,
} from './dto/question';

describe('QuestionConverterService', () => {
  let questionConverterService: QuestionConverterService;
  beforeEach(() => {
    questionConverterService = new QuestionConverterService();
  });

  it('should be defined', () => {
    expect(questionConverterService).toBeDefined();
  });

  describe('convert', () => {
    it('should convert single choice question to correct type', () => {
      const question = new Question();
      const single = (question.singleChoiceQuestion =
        new SingleChoiceQuestion());
      single.answers = ['A', 'B', 'C'];
      single.correctAnswer = 'A';
      const result = questionConverterService.convert(
        question,
      ) as SingleChoiceQuestionDTO;
      expect(result.answers).toEqual(['A', 'B', 'C']);
      expect(result.correctAnswer).toEqual('A');
    });
    it('should convert multiple choice question to correct type', () => {
      const question = new Question();
      const multiple = (question.multipleChoiceQuestion =
        new MultipleChoiceQuestion());
      multiple.answers = ['A', 'B', 'C'];
      multiple.correctAnswers = ['A', 'C'];
      const result = questionConverterService.convert(
        question,
      ) as MultipleChoiceQuestionDTO;
      expect(result.answers).toEqual(['A', 'B', 'C']);
      expect(result.correctAnswers).toEqual(['A', 'C']);
    });
    it('should convert sorting question to correct type', () => {
      const question = new Question();
      const sorting = (question.sortingQuestion = new SortingQuestion());
      sorting.answers = ['A', 'B', 'C'];
      sorting.correctOrder = ['A', 'C', 'B'];
      const result = questionConverterService.convert(
        question,
      ) as SortingQuestionDTO;
      expect(result.answers).toEqual(['A', 'B', 'C']);
      expect(result.correctOrder).toEqual(['A', 'C', 'B']);
    });
    it('should convert text question to correct type', () => {
      const question = new Question();
      const text = (question.textQuestion = new TextQuestion());
      text.correctAnswer = 'correct answer';
      const result = questionConverterService.convert(
        question,
      ) as TextQuestionDTO;
      expect(result.correctAnswer).toEqual('correct answer');
    });
  });
});
