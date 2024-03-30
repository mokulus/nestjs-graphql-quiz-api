import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesResolver } from './quizzes.resolver';

@Module({
  providers: [QuizzesResolver, QuizzesService],
})
export class QuizzesModule {}
