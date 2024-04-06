import { BadRequestException, Injectable } from '@nestjs/common';
import {
  MultipleChoiceQuestionSubmissionInputDTO,
  QuestionScoreDTO,
  QuestionSubmissionInputDTO,
  QuizScoreDTO,
  QuizSubmissionInputDTO,
  SingleChoiceQuestionSubmissionInputDTO,
  SortingQuestionSubmissionInputDTO,
  TextQuestionSubmissionInputDTO,
} from './dto/submission';
import { QuizzesService } from 'src/quizzes/quizzes.service';
import {
  MultipleChoiceQuestionDTO,
  QuestionDTO,
  SingleChoiceQuestionDTO,
  SortingQuestionDTO,
  TextQuestionDTO,
} from 'src/questions/dto/question';
import { QuestionSubmissionVisitor } from './submission.visitor';

@Injectable()
export class SubmissionsService {
  private readonly scorerVisitor = new ScorerVisitor();
  private readonly scoreValidator = new ScoreValidator();
  constructor(private readonly quizzesService: QuizzesService) {}

  async scoreQuiz(
    quizSubmission: QuizSubmissionInputDTO,
  ): Promise<QuizScoreDTO | null> {
    const quizDTO = await this.quizzesService.findById(+quizSubmission.quizID);
    if (quizDTO == null) return null;
    if (quizDTO.questions.length !== quizSubmission.submissions.length)
      throw new BadRequestException(
        'Validation error - submission list is too short/long',
      );
    quizDTO.questions.sort((a, b) => +a.id - +b.id);
    quizSubmission.submissions.sort((a, b) => +a.questionID - +b.questionID);
    const quizScore = new QuizScoreDTO();
    quizScore.scores = quizSubmission.submissions.map(
      (questionSubmission, index) => {
        const question = quizDTO.questions[index];
        const score = this.scoreQuestion(questionSubmission, question);
        score.questionID = question.id;
        return score;
      },
    );
    return quizScore;
  }

  private scoreQuestion(
    questionSubmission: QuestionSubmissionInputDTO,
    question: QuestionDTO,
  ): QuestionScoreDTO {
    if (questionSubmission.questionID !== question.id)
      throw new BadRequestException(
        'Validation error - submission question id mismatch',
      );
    this.scoreValidator.visit(questionSubmission, question);
    return this.scorerVisitor.visit(questionSubmission, question);
  }
}

class ScoreValidator extends QuestionSubmissionVisitor<void> {
  protected visitSingleChoice(
    singleChoiceQuestionSubmissionInput: SingleChoiceQuestionSubmissionInputDTO,
    singleChoiceQuestionDTO: SingleChoiceQuestionDTO,
  ): void {
    if (
      !singleChoiceQuestionDTO.answers.includes(
        singleChoiceQuestionSubmissionInput.answer,
      )
    ) {
      throw new BadRequestException(
        `Validation error - ${singleChoiceQuestionSubmissionInput.answer} is not a possible answer`,
      );
    }
  }
  protected visitMultipleChoice(
    multipleChoiceQuestionSubmissionInput: MultipleChoiceQuestionSubmissionInputDTO,
    multipleChoiceQuestionDTO: MultipleChoiceQuestionDTO,
  ): void {
    for (const answer of multipleChoiceQuestionSubmissionInput.answers) {
      if (!multipleChoiceQuestionDTO.answers.includes(answer)) {
        throw new BadRequestException(
          `Validation error - ${answer} is not a possible answer`,
        );
      }
    }
  }
  protected visitSorting(
    sortingQuestionSubmissionInputDTO: SortingQuestionSubmissionInputDTO,
    sortingQuestionDTO: SortingQuestionDTO,
  ): void {
    const correctSet = new Set(sortingQuestionDTO.correctOrder);
    if (
      correctSet.size !==
      new Set(sortingQuestionSubmissionInputDTO.answers).size
    ) {
      throw new BadRequestException(
        'Validation error - answers sets are not equal',
      );
    }
    for (const answer of sortingQuestionSubmissionInputDTO.answers) {
      if (!correctSet.has(answer)) {
        throw new BadRequestException(
          `Validation error - ${answer} is not a possible answer`,
        );
      }
    }
  }
  protected visitText(
    textQuestionSubmissionInputDTO: TextQuestionSubmissionInputDTO,
    textQuestionDTO: TextQuestionDTO,
  ): void {
    textQuestionSubmissionInputDTO as any;
    textQuestionDTO as any;
  }
}

class ScorerVisitor extends QuestionSubmissionVisitor<QuestionScoreDTO> {
  protected visitSingleChoice(
    singleChoiceQuestionSubmissionInput: SingleChoiceQuestionSubmissionInputDTO,
    singleChoiceQuestionDTO: SingleChoiceQuestionDTO,
  ): QuestionScoreDTO {
    const maximum = singleChoiceQuestionDTO.answers.length;
    const obtained =
      singleChoiceQuestionSubmissionInput.answer ==
      singleChoiceQuestionDTO.correctAnswer
        ? maximum
        : 0;
    return Object.assign(new QuestionScoreDTO(), { maximum, obtained });
  }
  protected visitMultipleChoice(
    multipleChoiceQuestionSubmissionInput: MultipleChoiceQuestionSubmissionInputDTO,
    multipleChoiceQuestionDTO: MultipleChoiceQuestionDTO,
  ): QuestionScoreDTO {
    const maximum = multipleChoiceQuestionDTO.correctAnswers.length;
    const set = new Set(multipleChoiceQuestionDTO.correctAnswers);
    const obtained = multipleChoiceQuestionSubmissionInput.answers.reduce(
      (acc, ans) => (set.has(ans) ? acc + 1 : acc),
      0,
    );
    return Object.assign(new QuestionScoreDTO(), { maximum, obtained });
  }
  protected visitSorting(
    sortingQuestionSubmissionInputDTO: SortingQuestionSubmissionInputDTO,
    sortingQuestionDTO: SortingQuestionDTO,
  ): QuestionScoreDTO {
    const maximum = sortingQuestionDTO.answers.length;
    const obtained = sortingQuestionSubmissionInputDTO.answers.reduce(
      (acc, answer, index) =>
        answer == sortingQuestionDTO.correctOrder[index] ? acc + 1 : acc,
      0,
    );
    return Object.assign(new QuestionScoreDTO(), { maximum, obtained });
  }
  protected visitText(
    textQuestionSubmissionInputDTO: TextQuestionSubmissionInputDTO,
    textQuestionDTO: TextQuestionDTO,
  ): QuestionScoreDTO {
    const normalize: (text: string) => string = (s) =>
      s.normalize().toLowerCase().replace(/\p{P}/gu, '');
    const maximum = 1;
    const obtained =
      normalize(textQuestionSubmissionInputDTO.answer) ===
      normalize(textQuestionDTO.correctAnswer);
    return Object.assign(new QuestionScoreDTO(), { maximum, obtained });
  }
}
