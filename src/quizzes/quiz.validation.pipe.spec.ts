import { Test } from '@nestjs/testing';
import { QuestionInputValidationService } from '../questions/question.validation';
import { CreateQuizInputDTO, UpdateQuizInputDTO } from './dto/quiz';
import { QuizInputValidationPipe } from './quiz.validation.pipe';
import { ArgumentMetadata } from '@nestjs/common';
import { QuestionInputDTO } from '../questions/dto/question';

describe('QuizInputValidationPipe', () => {
  let quizInputValidationPipe: QuizInputValidationPipe;
  let questionInputValidationService: QuestionInputValidationService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QuizInputValidationPipe,
        {
          provide: QuestionInputValidationService,
          useValue: {
            validate: jest.fn(),
          },
        },
      ],
    }).compile();
    quizInputValidationPipe = module.get(QuizInputValidationPipe);
    questionInputValidationService = module.get(QuestionInputValidationService);
  });

  it('should be defined', () => {
    expect(quizInputValidationPipe).toBeDefined();
  });

  describe('transform', () => {
    it('should call validate method of service for create inputs', async () => {
      const createQuizInput = new CreateQuizInputDTO();
      createQuizInput.questions = [
        new QuestionInputDTO(),
        new QuestionInputDTO(),
      ];
      quizInputValidationPipe.transform(
        createQuizInput,
        {} as ArgumentMetadata,
      );
      expect(questionInputValidationService.validate).toHaveBeenCalledTimes(2);
      for (let i = 0; i < 2; ++i)
        expect(questionInputValidationService.validate).toHaveBeenNthCalledWith(
          i + 1,
          createQuizInput.questions[i],
        );
    });

    it('should call validate method of service for update inputs', async () => {
      const updateQuizInputDTO = new UpdateQuizInputDTO();
      updateQuizInputDTO.questions = [
        new QuestionInputDTO(),
        new QuestionInputDTO(),
      ];
      quizInputValidationPipe.transform(
        updateQuizInputDTO,
        {} as ArgumentMetadata,
      );
      expect(questionInputValidationService.validate).toHaveBeenCalledTimes(2);
      for (let i = 0; i < 2; ++i)
        expect(questionInputValidationService.validate).toHaveBeenNthCalledWith(
          i + 1,
          updateQuizInputDTO.questions[i],
        );
    });

    it('should handle null questions for update inputs', async () => {
      const updateQuizInputDTO = new UpdateQuizInputDTO();
      updateQuizInputDTO.questions = undefined;
      quizInputValidationPipe.transform(
        updateQuizInputDTO,
        {} as ArgumentMetadata,
      );
      expect(questionInputValidationService.validate).not.toHaveBeenCalled();
    });
  });
});
