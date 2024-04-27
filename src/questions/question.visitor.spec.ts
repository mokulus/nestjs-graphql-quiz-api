import {
  SingleChoiceQuestionInputDTO,
  MultipleChoiceQuestionInputDTO,
  SortingQuestionInputDTO,
  TextQuestionInputDTO,
  QuestionInputDTO,
} from './dto/question';
import {
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  SortingQuestion,
  TextQuestion,
  Question,
} from './entitites/question.entity';
import {
  QuestionEntityVisitor,
  QuestionInputVisitor,
} from './question.visitor';

describe('QuestionInputVisitor', () => {
  let questionInputVisitor: QuestionInputVisitor<number>;

  beforeEach(() => {
    questionInputVisitor = new QuestionInputVisitorMock();
  });

  it('should be defined', () => {
    expect(questionInputVisitor).toBeDefined();
  });

  describe('visit', () => {
    it('should dispatch single choice question correctly', () => {
      const question = new QuestionInputDTO();
      question.singleChoiceQuestionInput = new SingleChoiceQuestionInputDTO();
      expect(questionInputVisitor.visit(question)).toEqual(0);
    });
    it('should dispatch multiple choice question correctly', () => {
      const question = new QuestionInputDTO();
      question.multipleChoiceQuestionInput =
        new MultipleChoiceQuestionInputDTO();
      expect(questionInputVisitor.visit(question)).toEqual(1);
    });
    it('should dispatch sorting question correctly', () => {
      const question = new QuestionInputDTO();
      question.sortingQuestionInput = new SortingQuestionInputDTO();
      expect(questionInputVisitor.visit(question)).toEqual(2);
    });
    it('should dispatch text question correctly', () => {
      const question = new QuestionInputDTO();
      question.textQuestionInput = new TextQuestionInputDTO();
      expect(questionInputVisitor.visit(question)).toEqual(3);
    });
    it('should throw on invalid input', () => {
      expect(() =>
        questionInputVisitor.visit(new QuestionInputDTO()),
      ).toThrow();
    });
  });
});

describe('QuestionEntityVisitor', () => {
  let questionEntityVisitor: QuestionEntityVisitor<string>;

  beforeEach(() => {
    questionEntityVisitor = new QuestionEntityVisitorMock();
  });

  it('should be defined', () => {
    expect(questionEntityVisitor).toBeDefined();
  });

  describe('visit', () => {
    it('should dispatch single choice question correctly', () => {
      const question = new Question();
      question.singleChoiceQuestion = new SingleChoiceQuestion();
      expect(questionEntityVisitor.visit(question)).toEqual('a');
    });

    it('should dispatch multiple choice question correctly', () => {
      const question = new Question();
      question.multipleChoiceQuestion = new MultipleChoiceQuestion();
      expect(questionEntityVisitor.visit(question)).toEqual('b');
    });

    it('should dispatch sorting question correctly', () => {
      const question = new Question();
      question.sortingQuestion = new SortingQuestion();
      expect(questionEntityVisitor.visit(question)).toEqual('c');
    });

    it('should dispatch text question correctly', () => {
      const question = new Question();
      question.textQuestion = new TextQuestion();
      expect(questionEntityVisitor.visit(question)).toEqual('d');
    });
    it('should throw on invalid input', () => {
      expect(() => questionEntityVisitor.visit(new Question())).toThrow();
    });
  });
});

class QuestionInputVisitorMock extends QuestionInputVisitor<number> {
  protected visitSingleChoiceQuestionInput(
    _singleChoiceQuestionInputDTO: SingleChoiceQuestionInputDTO,
  ): number {
    return 0;
  }

  protected visitMultipleChoiceQuestionInput(
    _multipleChoiceQuestionInputDTO: MultipleChoiceQuestionInputDTO,
  ): number {
    return 1;
  }

  protected visitSortingQuestionInput(
    _sortingQuestionInput: SortingQuestionInputDTO,
  ): number {
    return 2;
  }

  protected visitTextQuestionInput(
    _textQuestionInput: TextQuestionInputDTO,
  ): number {
    return 3;
  }
}

class QuestionEntityVisitorMock extends QuestionEntityVisitor<string> {
  protected visitSingleChoiceQuestionEntity(
    _singleChoiceQuestion: SingleChoiceQuestion,
  ): string {
    return 'a';
  }
  protected visitMultipleChoiceQuestionEntity(
    _multipleChoiceQuestion: MultipleChoiceQuestion,
  ): string {
    return 'b';
  }
  protected visitSortingQuestion(_sortingQuestion: SortingQuestion): string {
    return 'c';
  }
  protected visitTextQuestion(_textQuestion: TextQuestion): string {
    return 'd';
  }
}
