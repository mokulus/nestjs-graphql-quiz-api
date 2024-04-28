import { SubmissionsService } from './submissions.service';
import { Test } from '@nestjs/testing';
import { QuizzesService } from '../quizzes/quizzes.service';
import {
  MultipleChoiceQuestionSubmissionInputDTO,
  QuestionSubmissionInputDTO,
  QuizSubmissionInputDTO,
  SingleChoiceQuestionSubmissionInputDTO,
  SortingQuestionSubmissionInputDTO,
  TextQuestionSubmissionInputDTO,
} from './dto/submission';
import { QuizDTO } from '../quizzes/dto/quiz';
import {
  MultipleChoiceQuestionDTO,
  SingleChoiceQuestionDTO,
  SortingQuestionDTO,
  TextQuestionDTO,
} from '../questions/dto/question';

describe('SubmissionsService', () => {
  let submissionsService: SubmissionsService;
  let quizzesService: QuizzesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SubmissionsService,
        {
          provide: QuizzesService,
          useValue: {
            findById: jest.fn(() => {
              const quiz = new QuizDTO();
              quiz.id = '0';
              quiz.name = 'Quiz';
              const single = new SingleChoiceQuestionDTO();
              single.id = '0';
              single.prompt = 'Single choice prompt';
              single.answers = ['A', 'B', 'C'];
              single.correctAnswer = 'A';
              const multiple = new MultipleChoiceQuestionDTO();
              multiple.id = '1';
              multiple.prompt = 'Multiple choice prompt';
              multiple.answers = ['A', 'B', 'C'];
              multiple.correctAnswers = ['A', 'C'];
              const sorting = new SortingQuestionDTO();
              sorting.id = '2';
              sorting.prompt = 'Sorting prompt';
              sorting.answers = ['A', 'B', 'C'];
              sorting.correctOrder = ['A', 'C', 'B'];
              const text = new TextQuestionDTO();
              text.id = '3';
              text.prompt = 'Text prompt';
              text.correctAnswer = 'answer';
              quiz.questions = [single, multiple, sorting, text];
              return quiz;
            }),
          },
        },
      ],
    }).compile();

    submissionsService = module.get(SubmissionsService);
    quizzesService = module.get(QuizzesService);
  });

  it('should be defined', () => {
    expect(submissionsService).toBeDefined();
  });

  describe('scoreQuiz', () => {
    it('should use findById method of quizzes service', async () => {
      jest
        .mocked(quizzesService.findById)
        .mockReturnValue(Promise.resolve(null));
      await submissionsService.scoreQuiz(new QuizSubmissionInputDTO());
      expect(quizzesService.findById).toHaveBeenCalledTimes(1);
    });

    it('should return null for missing quiz', async () => {
      jest
        .mocked(quizzesService.findById)
        .mockReturnValue(Promise.resolve(null));
      const result = await submissionsService.scoreQuiz(
        new QuizSubmissionInputDTO(),
      );
      expect(result).toBeNull();
    });

    it('should throw on invalid submission length', async () => {
      const submission = new QuizSubmissionInputDTO();
      submission.quizID = '0';
      submission.submissions = [];
      await expect(
        async () => await submissionsService.scoreQuiz(submission),
      ).rejects.toThrow('list is too short/long');
      submission.submissions = [];
      for (let i = 0; i < 5; ++i)
        submission.submissions.push(new QuestionSubmissionInputDTO());
      await expect(
        async () => await submissionsService.scoreQuiz(submission),
      ).rejects.toThrow('list is too short/long');
    });

    it('should throw on invalid question ids', async () => {
      const submission = makeSubmission();
      ['0', '0', '1', '2'].map(
        (value, index) => (submission.submissions[index].questionID = value),
      );
      await expect(
        async () => await submissionsService.scoreQuiz(submission),
      ).rejects.toThrow('id mismatch');
      ['0', '1', '2', '4'].map(
        (value, index) => (submission.submissions[index].questionID = value),
      );
      await expect(
        async () => await submissionsService.scoreQuiz(submission),
      ).rejects.toThrow('id mismatch');
    });

    it('should score correct input', async () => {
      const submission = makeSubmission();
      const result = await submissionsService.scoreQuiz(submission);
      expect(result).not.toBeNull();
      expect(result?.scores).toHaveLength(4);
      for (let i = 0; i < 4; ++i)
        expect(result?.scores[i].obtained).toBe([3, 2, 3, 1][i]);
      expect(result?.totalObtained).toBeUndefined();
      expect(result?.totalMaximum).toBeUndefined();
    });

    describe('single choice', () => {
      it('should throw on invalid answer', async () => {
        const submission = makeSubmission();
        submission.submissions[0].singleChoiceQuestionSubmissionInput!.answer =
          'E';
        await expect(
          async () => await submissionsService.scoreQuiz(submission),
        ).rejects.toThrow('not a possible answer');
      });

      it('should score correctly', async () => {
        const submission = makeSubmission();
        submission.submissions[0].singleChoiceQuestionSubmissionInput!.answer =
          'A';
        let result = await submissionsService.scoreQuiz(submission);
        expect(result?.scores[0].obtained).toEqual(3);
        expect(result?.scores[0].maximum).toEqual(3);
        submission.submissions[0].singleChoiceQuestionSubmissionInput!.answer =
          'B';
        result = await submissionsService.scoreQuiz(submission);
        expect(result?.scores[0].obtained).toEqual(0);
        expect(result?.scores[0].maximum).toEqual(3);
      });
    });

    describe('multiple choice', () => {
      it('should throw on invalid answer', async () => {
        const submission = makeSubmission();
        submission.submissions[1].multipleChoiceQuestionSubmissionInput!.answers =
          ['A', 'E'];
        await expect(
          async () => await submissionsService.scoreQuiz(submission),
        ).rejects.toThrow('not a possible answer');
      });

      it('should score correctly', async () => {
        const submission = makeSubmission();
        submission.submissions[1].multipleChoiceQuestionSubmissionInput!.answers =
          ['B'];
        let result = await submissionsService.scoreQuiz(submission);
        expect(result?.scores[1].obtained).toEqual(0);
        expect(result?.scores[1].maximum).toEqual(2);
        submission.submissions[1].multipleChoiceQuestionSubmissionInput!.answers =
          ['A', 'B'];
        result = await submissionsService.scoreQuiz(submission);
        expect(result?.scores[1].obtained).toEqual(0);
        expect(result?.scores[1].maximum).toEqual(2);
        submission.submissions[1].multipleChoiceQuestionSubmissionInput!.answers =
          ['A', 'C'];
        result = await submissionsService.scoreQuiz(submission);
        expect(result?.scores[1].obtained).toEqual(2);
        expect(result?.scores[1].maximum).toEqual(2);
      });
    });

    describe('sorting', () => {
      it('should throw if sets are not equal size', async () => {
        const submission = makeSubmission();
        submission.submissions[2].sortingQuestionSubmissionInput!.answers = [
          'A',
          'B',
          'C',
          'D',
        ];
        await expect(
          async () => await submissionsService.scoreQuiz(submission),
        ).rejects.toThrow('sets are not equal');
      });
      it('should throw on invalid answer', async () => {
        const submission = makeSubmission();
        submission.submissions[2].sortingQuestionSubmissionInput!.answers = [
          'A',
          'B',
          'E',
        ];
        await expect(
          async () => await submissionsService.scoreQuiz(submission),
        ).rejects.toThrow('not a possible answer');
      });
      it('should score correctly', async () => {
        const submission = makeSubmission();
        submission.submissions[2].sortingQuestionSubmissionInput!.answers = [
          'C',
          'B',
          'A',
        ];
        let result = await submissionsService.scoreQuiz(submission);
        expect(result?.scores[2].obtained).toEqual(0);
        expect(result?.scores[2].maximum).toEqual(3);

        submission.submissions[2].sortingQuestionSubmissionInput!.answers = [
          'A',
          'B',
          'C',
        ];
        result = await submissionsService.scoreQuiz(submission);
        expect(result?.scores[2].obtained).toEqual(1);
        expect(result?.scores[2].maximum).toEqual(3);

        submission.submissions[2].sortingQuestionSubmissionInput!.answers = [
          'A',
          'C',
          'B',
        ];
        result = await submissionsService.scoreQuiz(submission);
        expect(result?.scores[2].obtained).toEqual(3);
        expect(result?.scores[2].maximum).toEqual(3);
      });
    });

    describe('text', () => {
      it('should allow any input', async () => {
        const submission = makeSubmission();
        submission.submissions[3].textQuestionSubmissionInput!.answer =
          'any answer';
        const result = await submissionsService.scoreQuiz(submission);
        expect(result).not.toBeNull();
      });
      it('should score correctly', async () => {
        const submission = makeSubmission();
        submission.submissions[3].textQuestionSubmissionInput!.answer = 'wrong';
        let result = await submissionsService.scoreQuiz(submission);
        expect(result?.scores[3].obtained).toEqual(0);
        expect(result?.scores[3].maximum).toEqual(1);

        submission.submissions[3].textQuestionSubmissionInput!.answer =
          'answer';
        result = await submissionsService.scoreQuiz(submission);
        expect(result?.scores[3].obtained).toEqual(1);
        expect(result?.scores[3].maximum).toEqual(1);
      });
    });
  });
});

function makeSubmission() {
  const submission = new QuizSubmissionInputDTO();
  submission.quizID = '0';
  const single = new SingleChoiceQuestionSubmissionInputDTO();
  single.answer = 'A';
  const multiple = new MultipleChoiceQuestionSubmissionInputDTO();
  multiple.answers = ['A', 'C'];
  const sorting = new SortingQuestionSubmissionInputDTO();
  sorting.answers = ['A', 'C', 'B'];
  const text = new TextQuestionSubmissionInputDTO();
  text.answer = 'answer';
  submission.submissions = [
    Object.assign(new QuestionSubmissionInputDTO(), {
      questionID: '0',
      singleChoiceQuestionSubmissionInput: single,
    }),
    Object.assign(new QuestionSubmissionInputDTO(), {
      questionID: '1',
      multipleChoiceQuestionSubmissionInput: multiple,
    }),
    Object.assign(new QuestionSubmissionInputDTO(), {
      questionID: '2',
      sortingQuestionSubmissionInput: sorting,
    }),
    Object.assign(new QuestionSubmissionInputDTO(), {
      questionID: '3',
      textQuestionSubmissionInput: text,
    }),
  ];
  return submission;
}
