import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { QuizzesService } from './quizzes.service';
import { CreateQuizInputDTO } from './dto/quiz';
import { QuestionsService } from 'src/questions/questions.service';
import { QuizInputValidationPipe } from './quiz.validation.pipe';

@Resolver('Quiz')
export class QuizzesResolver {
  constructor(
    private readonly quizzesService: QuizzesService,
    private readonly questionsService: QuestionsService,
  ) {}

  @Mutation('createQuiz')
  async create(
    @Args('createQuizInput', QuizInputValidationPipe)
    createQuizInput: CreateQuizInputDTO,
  ) {
    const o = await this.quizzesService.create(createQuizInput);
    return o;
  }

  @Query('quizzes')
  quizzes() {
    return this.quizzesService.findAll();
  }

  @Query('quiz')
  quiz(@Args('id') id: string) {
    return this.quizzesService.findById(+id);
  }
}
