import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { SubmissionsService } from './submissions.service';
import { QuizScoreDTO, QuizSubmissionInputDTO } from './dto/submission';

@Resolver('QuizScore')
export class SubmissionsResolver {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Query('scoreQuizSubmission')
  async scoreQuizSubmission(
    @Args('quizSubmissionInput')
    quizSubmission: QuizSubmissionInputDTO,
  ): Promise<QuizScoreDTO | null> {
    return this.submissionsService.scoreQuiz(quizSubmission);
  }

  @ResolveField('totalObtained')
  totalObtained(@Parent() quizScore: QuizScoreDTO) {
    return quizScore.scores.reduce((acc, score) => acc + score.obtained, 0);
  }

  @ResolveField('totalMaximum')
  totalMaximum(@Parent() quizScore: QuizScoreDTO) {
    return quizScore.scores.reduce((acc, score) => acc + score.maximum, 0);
  }
}
