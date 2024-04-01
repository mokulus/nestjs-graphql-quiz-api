import {
  MultipleChoiceQuestionInputDTO,
  QuestionInputDTO,
  SingleChoiceQuestionInputDTO,
  SortingQuestionInputDTO,
  TextQuestionInputDTO,
} from './dto/question';

export abstract class QuestionInputVisitor<R> {
  abstract visitSingleChoiceQuestionInput(
    singleChoiceQuestionInputDTO: SingleChoiceQuestionInputDTO,
  ): R;

  abstract visitMultipleChoiceQuestionInput(
    multipleChoiceQuestionInputDTO: MultipleChoiceQuestionInputDTO,
  ): R;

  abstract visitSortingQuestionInput(
    sortingQuestionInput: SortingQuestionInputDTO,
  ): R;

  abstract visitTextQuestionInput(textQuestionInput: TextQuestionInputDTO): R;

  visit(questionInput: QuestionInputDTO): R {
    if (questionInput.singleChoiceQuestionInput !== null) {
      return this.visitSingleChoiceQuestionInput(
        questionInput.singleChoiceQuestionInput,
      );
    } else if (questionInput.multipleChoiceQuestionInput !== null) {
      return this.visitMultipleChoiceQuestionInput(
        questionInput.multipleChoiceQuestionInput,
      );
    } else if (questionInput.sortingChoiceQuestionInput !== null) {
      return this.visitSortingQuestionInput(
        questionInput.sortingChoiceQuestionInput,
      );
    } else if (questionInput.textQuestionInput !== null) {
      return this.visitTextQuestionInput(questionInput.textQuestionInput);
    } else {
      throw new Error('Missing or unexpected question input');
    }
  }
}
