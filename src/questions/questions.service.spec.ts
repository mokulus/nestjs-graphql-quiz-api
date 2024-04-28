import { QuestionsService } from './questions.service';
import { Test } from '@nestjs/testing';
import { QuestionInputValidationService } from './question.validation';
import {
  MultipleChoiceQuestionInputDTO,
  QuestionInputDTO,
  SingleChoiceQuestionInputDTO,
  SortingQuestionInputDTO,
  TextQuestionInputDTO,
} from './dto/question';

describe('QuestionsService', () => {
  let questionsService: QuestionsService;
  let questionInputValidationService: QuestionInputValidationService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: QuestionInputValidationService,
          useValue: {
            validate: jest.fn((a) => a),
          },
        },
      ],
    }).compile();
    questionsService = module.get(QuestionsService);
    questionInputValidationService = module.get(QuestionInputValidationService);
  });

  it('should be defined', () => {
    expect(questionsService).toBeDefined();
  });

  describe('makeEntity', () => {
    it('should use validate service', async () => {
      const questionInput = new QuestionInputDTO();
      questionInput.singleChoiceQuestionInput =
        new SingleChoiceQuestionInputDTO();
      questionsService.makeEntity(questionInput);
      expect(questionInputValidationService.validate).toHaveBeenCalled();
    });

    it('should pass on parameters for single choice questions', async () => {
      const questionInput = new QuestionInputDTO();
      const singleChoiceQuestionInput = new SingleChoiceQuestionInputDTO();
      singleChoiceQuestionInput.prompt = 'the prompt';
      singleChoiceQuestionInput.answers = ['A', 'B', 'C'];
      singleChoiceQuestionInput.correctAnswer = 'C';
      questionInput.singleChoiceQuestionInput = singleChoiceQuestionInput;
      const result = questionsService.makeEntity(questionInput);
      expect(result.prompt).toEqual('the prompt');
      expect(result.singleChoiceQuestion.answers).toEqual(['A', 'B', 'C']);
      expect(result.singleChoiceQuestion.correctAnswer).toEqual('C');
    });

    it('should pass on parameters for multiple choice questions', async () => {
      const questionInput = new QuestionInputDTO();
      const multipleChoiceQuestionInput = new MultipleChoiceQuestionInputDTO();
      multipleChoiceQuestionInput.prompt = 'the prompt';
      multipleChoiceQuestionInput.answers = ['A', 'B', 'C'];
      multipleChoiceQuestionInput.correctAnswers = ['A', 'C'];
      questionInput.multipleChoiceQuestionInput = multipleChoiceQuestionInput;
      const result = questionsService.makeEntity(questionInput);
      expect(result.prompt).toEqual('the prompt');
      expect(result.multipleChoiceQuestion.answers).toEqual(['A', 'B', 'C']);
      expect(result.multipleChoiceQuestion.correctAnswers).toEqual(['A', 'C']);
    });

    it('should pass on parameters for sorting questions', async () => {
      const questionInput = new QuestionInputDTO();
      const sortingQuestionInput = new SortingQuestionInputDTO();
      sortingQuestionInput.prompt = 'the prompt';
      sortingQuestionInput.answers = ['A', 'B', 'C'];
      sortingQuestionInput.correctOrder = ['B', 'C', 'A'];
      questionInput.sortingQuestionInput = sortingQuestionInput;
      const result = questionsService.makeEntity(questionInput);
      expect(result.prompt).toEqual('the prompt');
      expect(result.sortingQuestion.answers).toEqual(['A', 'B', 'C']);
      expect(result.sortingQuestion.correctOrder).toEqual(['B', 'C', 'A']);
    });

    it('should pass on parameters for text questions', async () => {
      const questionInput = new QuestionInputDTO();
      const textQuestionInput = new TextQuestionInputDTO();
      textQuestionInput.prompt = 'the prompt';
      textQuestionInput.correctAnswer = 'the correct answer';
      questionInput.textQuestionInput = textQuestionInput;
      const result = questionsService.makeEntity(questionInput);
      expect(result.prompt).toEqual('the prompt');
      expect(result.textQuestion.correctAnswer).toEqual('the correct answer');
    });
  });
});
