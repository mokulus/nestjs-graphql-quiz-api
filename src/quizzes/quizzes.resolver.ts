import { Resolver, Query, Mutation, Args, Info } from '@nestjs/graphql';
import { QuizzesService } from './quizzes.service';
import { CreateQuizInputDTO, UpdateQuizInputDTO } from './dto/quiz';
import { QuizInputValidationPipe } from './quiz.validation.pipe';
import { GraphQLResolveInfo } from 'graphql/type';

@Resolver('Quiz')
export class QuizzesResolver {
  constructor(private readonly quizzesService: QuizzesService) {}

  private getKeys(info: GraphQLResolveInfo): string[] {
    return info.fieldNodes[0].selectionSet!.selections.flatMap((item) => {
      if ('name' in item) {
        return [item.name.value];
      } else {
        return [];
      }
    });
  }

  @Mutation('createQuiz')
  async create(
    @Args('createQuizInput', QuizInputValidationPipe)
    createQuizInput: CreateQuizInputDTO,
  ) {
    return this.quizzesService.create(createQuizInput);
  }

  @Mutation('updateQuiz')
  async update(
    @Args('updateQuizInput', QuizInputValidationPipe)
    updateQuizInput: UpdateQuizInputDTO,
  ) {
    return this.quizzesService.update(updateQuizInput);
  }

  @Mutation('removeQuiz')
  async remove(@Args('id') id: string) {
    return this.quizzesService.remove(+id);
  }

  @Query('quizzes')
  quizzes(@Info() info: GraphQLResolveInfo) {
    return this.quizzesService.findAll(
      this.getKeys(info).includes('questions'),
    );
  }

  @Query('quiz')
  quiz(@Info() info: GraphQLResolveInfo, @Args('id') id: string) {
    return this.quizzesService.findById(
      +id,
      this.getKeys(info).includes('questions'),
    );
  }
}
