import {
  MultipleChoiceQuestionInputDTO,
  QuestionInputDTO,
  SingleChoiceQuestionInputDTO,
  SortingQuestionInputDTO,
  TextQuestionInputDTO,
} from './dto/question';
import {
  MultipleChoiceQuestion,
  Question,
  SingleChoiceQuestion,
  SortingQuestion,
  TextQuestion,
} from './entitites/question.entity';

export abstract class QuestionInputVisitor<R> {
  protected abstract visitSingleChoiceQuestionInput(
    singleChoiceQuestionInputDTO: SingleChoiceQuestionInputDTO,
  ): R;

  protected abstract visitMultipleChoiceQuestionInput(
    multipleChoiceQuestionInputDTO: MultipleChoiceQuestionInputDTO,
  ): R;

  protected abstract visitSortingQuestionInput(
    sortingQuestionInput: SortingQuestionInputDTO,
  ): R;

  protected abstract visitTextQuestionInput(
    textQuestionInput: TextQuestionInputDTO,
  ): R;

  visit(questionInput: QuestionInputDTO): R {
    if (questionInput.singleChoiceQuestionInput != null) {
      return this.visitSingleChoiceQuestionInput(
        questionInput.singleChoiceQuestionInput,
      );
    } else if (questionInput.multipleChoiceQuestionInput != null) {
      return this.visitMultipleChoiceQuestionInput(
        questionInput.multipleChoiceQuestionInput,
      );
    } else if (questionInput.sortingChoiceQuestionInput != null) {
      return this.visitSortingQuestionInput(
        questionInput.sortingChoiceQuestionInput,
      );
    } else if (questionInput.textQuestionInput != null) {
      return this.visitTextQuestionInput(questionInput.textQuestionInput);
    } else {
      throw new Error('Missing or unexpected question input');
    }
  }
}

export abstract class QuestionEntityVisitor<R> {
  protected abstract visitSingleChoiceQuestionEntity(
    singleChoiceQuestion: SingleChoiceQuestion,
  ): R;

  protected abstract visitMultipleChoiceQuestionEntity(
    multipleChoiceQuestion: MultipleChoiceQuestion,
  ): R;

  protected abstract visitSortingQuestion(sortingQuestion: SortingQuestion): R;

  protected abstract visitTextQuestion(textQuestion: TextQuestion): R;

  visit(question: Question): R {
    if (question.singleChoiceQuestion != null) {
      return this.visitSingleChoiceQuestionEntity(
        question.singleChoiceQuestion,
      );
    } else if (question.multipleChoiceQuestion != null) {
      return this.visitMultipleChoiceQuestionEntity(
        question.multipleChoiceQuestion,
      );
    } else if (question.sortingQuestion != null) {
      return this.visitSortingQuestion(question.sortingQuestion);
    } else if (question.textQuestion != null) {
      return this.visitTextQuestion(question.textQuestion);
    } else {
      throw new Error('Missing or unexpected question entity');
    }
  }
}
