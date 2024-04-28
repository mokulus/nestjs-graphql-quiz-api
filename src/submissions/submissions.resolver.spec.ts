import { SubmissionsResolver } from './submissions.resolver';
import { SubmissionsService } from './submissions.service';
import { Test } from '@nestjs/testing';
import {
  QuestionScoreDTO,
  QuizScoreDTO,
  QuizSubmissionInputDTO,
} from './dto/submission';

describe('SubmissionsResolver', () => {
  let submissionsResolver: SubmissionsResolver;
  let submissionsService: SubmissionsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SubmissionsResolver,
        {
          provide: SubmissionsService,
          useValue: {
            scoreQuiz: jest.fn(),
          },
        },
      ],
    }).compile();

    submissionsResolver = module.get(SubmissionsResolver);
    submissionsService = module.get(SubmissionsService);
  });

  it('should be defined', () => {
    expect(submissionsResolver).toBeDefined();
  });

  describe('scoreQuizSubmission', () => {
    it('should use scoreQuiz of submissions service', async () => {
      const score = new QuizScoreDTO();
      jest
        .mocked(submissionsService)
        .scoreQuiz.mockReturnValue(Promise.resolve(score));
      const result = await submissionsResolver.scoreQuizSubmission(
        new QuizSubmissionInputDTO(),
      );
      expect(submissionsService.scoreQuiz).toHaveBeenCalled();
      expect(result).toBe(score);
    });
  });

  describe('totalObtained', () => {
    it('should return sum of obtained scores', () => {
      const score = new QuizScoreDTO();
      score.scores = [
        Object.assign(new QuestionScoreDTO(), { obtained: 1 }),
        Object.assign(new QuestionScoreDTO(), { obtained: 123 }),
        Object.assign(new QuestionScoreDTO(), { obtained: 56 }),
      ];
      expect(submissionsResolver.totalObtained(score)).toEqual(180);
    });
  });
  describe('totalMaximum', () => {
    it('should return sum of maximum scores', () => {
      const score = new QuizScoreDTO();
      score.scores = [
        Object.assign(new QuestionScoreDTO(), { maximum: 2 }),
        Object.assign(new QuestionScoreDTO(), { maximum: 164 }),
        Object.assign(new QuestionScoreDTO(), { maximum: 34 }),
      ];
      expect(submissionsResolver.totalMaximum(score)).toEqual(200);
    });
  });
});
