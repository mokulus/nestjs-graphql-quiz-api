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
