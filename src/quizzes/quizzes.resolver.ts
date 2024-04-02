import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { QuizzesService } from './quizzes.service';
import { CreateQuizInputDTO } from './dto/quiz';
import { QuestionsService } from 'src/questions/questions.service';

@Resolver('Quiz')
export class QuizzesResolver {
  constructor(
    private readonly quizzesService: QuizzesService,
    private readonly questionsService: QuestionsService,
  ) {}

  @Mutation('createQuiz')
  async create(@Args('createQuizInput') createQuizInput: CreateQuizInputDTO) {
    const o = await this.quizzesService.create(createQuizInput);
    return o;
  }

  @Query('quizzes')
  quizzes() {
    return this.quizzesService.findAll();
  }
}
