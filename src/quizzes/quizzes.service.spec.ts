import { Test, TestingModule } from '@nestjs/testing';
import { QuizzesService } from './quizzes.service';
import { Quiz } from './entities/quiz.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QuestionsService } from '../questions/questions.service';
import { QuestionConverterService } from '../questions/question.convert';
import { CreateQuizInputDTO, UpdateQuizInputDTO } from './dto/quiz';
import { Repository } from 'typeorm';
import {
  QuestionInputDTO,
  SingleChoiceQuestionInputDTO,
} from '../questions/dto/question';
import { QuestionInputValidationService } from '../questions/question.validation';
import {
  Question,
  SingleChoiceQuestion,
} from '../questions/entitites/question.entity';

function makeSingleChoiceQuestionInput(): QuestionInputDTO {
  const questionInput = new QuestionInputDTO();
  const singleChoiceQuestionInput = new SingleChoiceQuestionInputDTO();
  singleChoiceQuestionInput.prompt = 'Single choice question';
  singleChoiceQuestionInput.answers = ['A', 'B'];
  singleChoiceQuestionInput.correctAnswer = 'A';
  questionInput.singleChoiceQuestionInput = singleChoiceQuestionInput;
  return questionInput;
}

describe('QuizzesService', () => {
  let quizzesService: QuizzesService;
  let questionsService: QuestionsService;
  let repository: Repository<Quiz>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizzesService,
        {
          provide: getRepositoryToken(Quiz),
          useValue: {
            save: jest.fn((a: Quiz) => {
              a.questions = a.questions?.map((q, i) =>
                Object.assign(q, { id: i }),
              );
              return Object.assign(a, { id: 0 });
            }),
            findOne: jest.fn(() => new Quiz()),
            find: jest.fn(),
            remove: jest.fn(() => Object.assign(new Quiz(), { id: 0 })),
          },
        },
        QuestionsService,
        QuestionConverterService,
        {
          provide: QuestionInputValidationService,
          useValue: {
            validate: jest.fn((a) => a),
          },
        },
      ],
    }).compile();

    quizzesService = module.get<QuizzesService>(QuizzesService);
    questionsService = module.get<QuestionsService>(QuestionsService);
    repository = module.get(getRepositoryToken(Quiz));
  });

  it('should be defined', () => {
    expect(quizzesService).toBeDefined();
  });

  describe('create', () => {
    it('should save in repository', async () => {
      const createQuizInput = new CreateQuizInputDTO();
      createQuizInput.name = 'Quiz';
      createQuizInput.questions = [];
      await quizzesService.create(createQuizInput);
      expect(repository.save).toHaveBeenCalled();
    });

    it('should use makeEntity correct number of times', async () => {
      const createQuizInput = new CreateQuizInputDTO();
      createQuizInput.name = 'Quiz';
      createQuizInput.questions = [
        makeSingleChoiceQuestionInput(),
        makeSingleChoiceQuestionInput(),
      ];
      const question = new Question();
      question.id = 0;
      const singleChoiceQuestion = new SingleChoiceQuestion();
      singleChoiceQuestion.id = 0;
      question.singleChoiceQuestion = singleChoiceQuestion;
      jest
        .spyOn(questionsService, 'makeEntity')
        .mockImplementation(() => question);
      await quizzesService.create(createQuizInput);
      expect(questionsService.makeEntity).toHaveBeenCalledTimes(2);
    });
  });

  describe('update', () => {
    it('should use findOne from repository', async () => {
      const updateQuizInput = new UpdateQuizInputDTO();
      await quizzesService.update(updateQuizInput);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('should use save from repository', async () => {
      const updateQuizInput = new UpdateQuizInputDTO();
      await quizzesService.update(updateQuizInput);
      expect(repository.save).toHaveBeenCalled();
    });

    it('should return null for nonexistent quiz', async () => {
      const updateQuizInput = new UpdateQuizInputDTO();
      jest.spyOn(repository, 'findOne').mockReturnValue(Promise.resolve(null));
      const result = await quizzesService.update(updateQuizInput);
      expect(result).toBeNull();
    });

    it('should update name when it is set', async () => {
      const updateQuizInput = new UpdateQuizInputDTO();
      updateQuizInput.id = '0';
      updateQuizInput.name = 'New name';
      const oldQuiz = new Quiz();
      oldQuiz.id = 0;
      oldQuiz.name = 'Old name';
      jest
        .spyOn(repository, 'findOne')
        .mockReturnValue(Promise.resolve(oldQuiz));
      const result = await quizzesService.update(updateQuizInput);
      expect(result).not.toBeNull();
      expect(result?.name).toStrictEqual('New name');
    });

    it('should update questions when they are set', async () => {
      const updateQuizInput = new UpdateQuizInputDTO();
      updateQuizInput.id = '0';
      updateQuizInput.questions = [
        Object.assign(new QuestionInputDTO(), {
          singleChoiceQuestionInput: Object.assign(
            new SingleChoiceQuestionInputDTO(),
            {
              prompt: 'prompt',
            },
          ),
        }),
      ];
      const oldQuiz = new Quiz();
      oldQuiz.id = 0;
      oldQuiz.name = 'Old name';
      oldQuiz.questions = [];
      jest
        .spyOn(repository, 'findOne')
        .mockReturnValue(Promise.resolve(oldQuiz));
      const result = await quizzesService.update(updateQuizInput);
      expect(result?.questions[0].prompt).toStrictEqual('prompt');
      expect(result?.name).toStrictEqual('Old name');
    });
  });

  describe('remove', () => {
    it('should use remove', async () => {
      await quizzesService.remove(0);
      expect(repository.remove).toHaveBeenCalled();
    });
    it('should return null for missing id', async () => {
      jest.spyOn(repository, 'findOne').mockReturnValue(Promise.resolve(null));
      const result = await quizzesService.remove(0);
      expect(result).toBeNull();
    });

    it('should return removed id', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockReturnValue(Promise.resolve(Object.assign(new Quiz(), { id: 0 })));
      const result = await quizzesService.remove(0);
      expect(result?.id).toEqual(0);
    });
  });

  describe('findAll', () => {
    it('should use findAll from repository', async () => {
      const quizzes = Array.from({ length: 4 }, (_, i) =>
        Object.assign(new Quiz(), { id: i }),
      );
      jest.spyOn(repository, 'find').mockReturnValue(Promise.resolve(quizzes));
      for (const fetch of [true, false]) {
        const result = await quizzesService.findAll(fetch);
        expect(repository.find).toHaveBeenCalled();
        expect(result?.length).toEqual(4);
        for (let i = 0; i < 4; ++i) expect(result[i]?.id).toEqual(i);
      }
    });
  });

  describe('findById', () => {
    it('should use findOne from repository', async () => {
      const quiz = Object.assign(new Quiz(), { id: 3 });
      jest.mocked(repository.findOne).mockReturnValue(Promise.resolve(quiz));
      for (const fetch of [true, false]) {
        const result = await quizzesService.findById(3, fetch);
        expect(result).not.toBeNull();
        expect(result?.id).toEqual(3);
      }
    });

    it('should return null for nonexistent quiz', async () => {
      jest.mocked(repository.findOne).mockReturnValue(Promise.resolve(null));
      for (const fetch of [true, false]) {
        const result = await quizzesService.findById(3, fetch);
        expect(result).toBeNull();
      }
    });
  });
});
