import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { QuizzesService } from './quizzes.service';
import { CreateQuizInput } from './dto/create-quiz.input';
import { UpdateQuizInput } from './dto/update-quiz.input';

@Resolver('Quiz')
export class QuizzesResolver {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Mutation('createQuiz')
  create(@Args('createQuizInput') createQuizInput: CreateQuizInput) {
    return this.quizzesService.create(createQuizInput);
  }

  @Query('quizzes')
  findAll() {
    return this.quizzesService.findAll();
  }

  @Query('quiz')
  findOne(@Args('id') id: number) {
    return this.quizzesService.findOne(id);
  }

  @Mutation('updateQuiz')
  update(@Args('updateQuizInput') updateQuizInput: UpdateQuizInput) {
    return this.quizzesService.update(updateQuizInput.id, updateQuizInput);
  }

  @Mutation('removeQuiz')
  remove(@Args('id') id: number) {
    return this.quizzesService.remove(id);
  }
}
