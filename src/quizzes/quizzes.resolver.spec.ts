import { Test, TestingModule } from '@nestjs/testing';
import { QuizzesResolver } from './quizzes.resolver';
import { QuizzesService } from './quizzes.service';
import { CreateQuizInputDTO, UpdateQuizInputDTO } from './dto/quiz';
import { QuestionInputValidationService } from '../questions/question.validation';

describe('QuizzesResolver', () => {
  let resolver: QuizzesResolver;
  let service: QuizzesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizzesResolver,
        QuestionInputValidationService,
        {
          provide: QuizzesService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<QuizzesResolver>(QuizzesResolver);
    service = module.get<QuizzesService>(QuizzesService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createQuiz', () => {
    it('should call create method of service', async () => {
      const createQuizInput = new CreateQuizInputDTO();
      await resolver.create(createQuizInput);
      expect(service.create).toHaveBeenCalledWith(createQuizInput);
    });
  });
  describe('updateQuiz', () => {
    it('should call update method of service', async () => {
      const updateQuizInput = new UpdateQuizInputDTO();
      await resolver.update(updateQuizInput);
      expect(service.update).toHaveBeenCalledWith(updateQuizInput);
    });
  });

  describe('remove', () => {
    it('should call remove method of service', async () => {
      const id = '1';
      await resolver.remove(id);
      expect(service.remove).toHaveBeenCalledWith(+id);
    });
  });

  describe('quizzes', () => {
    it('should call findAll method of service', async () => {
      await resolver.quizzes();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('quiz', () => {
    it('should call findById method of service with correct input', async () => {
      const id = '1';
      await resolver.quiz(id);
      expect(service.findById).toHaveBeenCalledWith(+id);
    });
  });
});
