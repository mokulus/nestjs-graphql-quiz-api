import {
  SingleChoiceQuestionDTO,
  MultipleChoiceQuestionDTO,
  SortingQuestionDTO,
  TextQuestionDTO,
  QuestionDTO,
} from '../questions/dto/question';
import {
  SingleChoiceQuestionSubmissionInputDTO,
  MultipleChoiceQuestionSubmissionInputDTO,
  SortingQuestionSubmissionInputDTO,
  TextQuestionSubmissionInputDTO,
  QuestionSubmissionInputDTO,
} from './dto/submission';
import { QuestionSubmissionVisitor } from './submission.visitor';

describe('SubmissionVisitor', () => {
  let questionSubmissionVisitor: QuestionSubmissionVisitor<number>;

  beforeEach(() => {
    questionSubmissionVisitor = new QuestionSubmissionVisitorMock();
  });

  it('should be defined', () => {
    expect(questionSubmissionVisitor).toBeDefined();
  });

  describe('visit', () => {
    it('should dispatch single choice question correctly', () => {
      expect(
        questionSubmissionVisitor.visit(
          makeSubmission('single'),
          makeQuestion('single'),
        ),
      ).toEqual(0);
    });
    it('should dispatch multiple choice question correctly', () => {
      expect(
        questionSubmissionVisitor.visit(
          makeSubmission('multiple'),
          makeQuestion('multiple'),
        ),
      ).toEqual(1);
    });
    it('should dispatch sorting question correctly', () => {
      expect(
        questionSubmissionVisitor.visit(
          makeSubmission('sorting'),
          makeQuestion('sorting'),
        ),
      ).toEqual(2);
    });
    it('should dispatch text question correctly', () => {
      expect(
        questionSubmissionVisitor.visit(
          makeSubmission('text'),
          makeQuestion('text'),
        ),
      ).toEqual(3);
    });
    it('should throw on invalid combination', () => {
      const types = ['single', 'multiple', 'sorting', 'text'] as const;
      for (const a of types) {
        for (const b of types) {
          if (a == b) continue;
          expect(() =>
            questionSubmissionVisitor.visit(makeSubmission(a), makeQuestion(b)),
          ).toThrow('mismatch');
        }
      }
    });
  });
});

class QuestionSubmissionVisitorMock extends QuestionSubmissionVisitor<number> {
  protected visitSingleChoice(
    _singleChoiceQuestionSubmissionInput: SingleChoiceQuestionSubmissionInputDTO,
    _singleChoiceQuestionDTO: SingleChoiceQuestionDTO,
  ): number {
    return 0;
  }
  protected visitMultipleChoice(
    _multipleChoiceQuestionSubmissionInput: MultipleChoiceQuestionSubmissionInputDTO,
    _multipleChoiceQuestionDTO: MultipleChoiceQuestionDTO,
  ): number {
    return 1;
  }
  protected visitSorting(
    _sortingQuestionSubmissionInputDTO: SortingQuestionSubmissionInputDTO,
    _sortingQuestionDTO: SortingQuestionDTO,
  ): number {
    return 2;
  }
  protected visitText(
    _textQuestionSubmissionInputDTO: TextQuestionSubmissionInputDTO,
    _textQuestionDTO: TextQuestionDTO,
  ): number {
    return 3;
  }
}

function makeQuestion(
  type: 'single' | 'multiple' | 'sorting' | 'text',
): QuestionDTO {
  const addCommon = (q: QuestionDTO) => {
    q.id = '0';
    q.prompt = 'prompt';
    return q;
  };
  if (type == 'single') {
    const question = new SingleChoiceQuestionDTO();
    question.answers = ['A', 'B', 'C'];
    question.correctAnswer = 'A';
    return addCommon(question);
  } else if (type == 'multiple') {
    const question = new MultipleChoiceQuestionDTO();
    question.answers = ['A', 'B', 'C'];
    question.correctAnswers = ['A', 'C'];
    return addCommon(question);
  } else if (type == 'sorting') {
    const question = new SortingQuestionDTO();
    question.answers = ['A', 'B', 'C'];
    question.correctOrder = ['A', 'C', 'B'];
    return addCommon(question);
  } else {
    const question = new TextQuestionDTO();
    question.correctAnswer = 'answer';
    return addCommon(question);
  }
}

function makeSubmission(
  type: 'single' | 'multiple' | 'sorting' | 'text',
): QuestionSubmissionInputDTO {
  const submission = new QuestionSubmissionInputDTO();
  if (type == 'single') {
    const single = new SingleChoiceQuestionSubmissionInputDTO();
    single.answer = 'A';
    submission.singleChoiceQuestionSubmissionInput = single;
  } else if (type == 'multiple') {
    const multiple = new MultipleChoiceQuestionSubmissionInputDTO();
    multiple.answers = ['A', 'C'];
    submission.multipleChoiceQuestionSubmissionInput = multiple;
  } else if (type == 'sorting') {
    const sorting = new SortingQuestionSubmissionInputDTO();
    sorting.answers = ['A', 'C', 'B'];
    submission.sortingQuestionSubmissionInput = sorting;
  } else {
    const text = new TextQuestionSubmissionInputDTO();
    text.answer = 'answer';
    submission.textQuestionSubmissionInput = text;
  }
  submission.questionID = '0';
  return submission;
}
