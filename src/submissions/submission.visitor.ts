import {
  MultipleChoiceQuestionDTO,
  QuestionDTO,
  SingleChoiceQuestionDTO,
  SortingQuestionDTO,
  TextQuestionDTO,
} from '../questions/dto/question';
import {
  MultipleChoiceQuestionSubmissionInputDTO,
  QuestionSubmissionInputDTO,
  SingleChoiceQuestionSubmissionInputDTO,
  SortingQuestionSubmissionInputDTO,
  TextQuestionSubmissionInputDTO,
} from './dto/submission';

export abstract class SubmissionInputVisitor<R> {
  protected abstract visitSingleChoiceQuestionSubmissionInput(
    singleChoiceQuestionSubmissionInput: SingleChoiceQuestionSubmissionInputDTO,
  ): R;

  protected abstract visitMultipleChoiceQuestionSubmissionInput(
    multipleChoiceQuestionSubmissionInput: MultipleChoiceQuestionSubmissionInputDTO,
  ): R;

  protected abstract visitSortingQuestionSubmissionInput(
    sortingQuestionSubmissionInputDTO: SortingQuestionSubmissionInputDTO,
  ): R;

  protected abstract visitTextQuestionSubmissionInput(
    textQuestionSubmissionInputDTO: TextQuestionSubmissionInputDTO,
  ): R;

  visit(questionSubmissionInput: QuestionSubmissionInputDTO): R {
    if (questionSubmissionInput.singleChoiceQuestionSubmissionInput != null) {
      return this.visitSingleChoiceQuestionSubmissionInput(
        questionSubmissionInput.singleChoiceQuestionSubmissionInput,
      );
    } else if (
      questionSubmissionInput.multipleChoiceQuestionSubmissionInput != null
    ) {
      return this.visitMultipleChoiceQuestionSubmissionInput(
        questionSubmissionInput.multipleChoiceQuestionSubmissionInput,
      );
    } else if (questionSubmissionInput.sortingQuestionSubmissionInput != null) {
      return this.visitSortingQuestionSubmissionInput(
        questionSubmissionInput.sortingQuestionSubmissionInput,
      );
    } else if (questionSubmissionInput.textQuestionSubmissionInput != null) {
      return this.visitTextQuestionSubmissionInput(
        questionSubmissionInput.textQuestionSubmissionInput,
      );
    } else {
      throw new Error('Missing or unexpected question submission input');
    }
  }
}

export abstract class QuestionSubmissionVisitor<R> {
  protected abstract visitSingleChoice(
    singleChoiceQuestionSubmissionInput: SingleChoiceQuestionSubmissionInputDTO,
    singleChoiceQuestionDTO: SingleChoiceQuestionDTO,
  ): R;

  protected abstract visitMultipleChoice(
    multipleChoiceQuestionSubmissionInput: MultipleChoiceQuestionSubmissionInputDTO,
    multipleChoiceQuestionDTO: MultipleChoiceQuestionDTO,
  ): R;

  protected abstract visitSorting(
    sortingQuestionSubmissionInputDTO: SortingQuestionSubmissionInputDTO,
    sortingQuestionDTO: SortingQuestionDTO,
  ): R;

  protected abstract visitText(
    textQuestionSubmissionInputDTO: TextQuestionSubmissionInputDTO,
    TextQuestionDTO: TextQuestionDTO,
  ): R;

  visit(
    questionSubmissionInput: QuestionSubmissionInputDTO,
    question: QuestionDTO,
  ): R {
    if (
      questionSubmissionInput.singleChoiceQuestionSubmissionInput != null &&
      question instanceof SingleChoiceQuestionDTO
    ) {
      return this.visitSingleChoice(
        questionSubmissionInput.singleChoiceQuestionSubmissionInput,
        question,
      );
    } else if (
      questionSubmissionInput.multipleChoiceQuestionSubmissionInput != null &&
      question instanceof MultipleChoiceQuestionDTO
    ) {
      return this.visitMultipleChoice(
        questionSubmissionInput.multipleChoiceQuestionSubmissionInput,
        question,
      );
    } else if (
      questionSubmissionInput.sortingQuestionSubmissionInput != null &&
      question instanceof SortingQuestionDTO
    ) {
      return this.visitSorting(
        questionSubmissionInput.sortingQuestionSubmissionInput,
        question,
      );
    } else if (
      questionSubmissionInput.textQuestionSubmissionInput != null &&
      question instanceof TextQuestionDTO
    ) {
      return this.visitText(
        questionSubmissionInput.textQuestionSubmissionInput,
        question,
      );
    } else {
      throw new Error('question / submission mismatch');
    }
  }
}
