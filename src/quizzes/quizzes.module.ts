import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesResolver } from './quizzes.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { QuestionsModule } from '../questions/questions.module';
import { QuizInputValidationPipe } from './quiz.validation.pipe';

@Module({
  providers: [QuizzesResolver, QuizzesService, QuizInputValidationPipe],
  imports: [TypeOrmModule.forFeature([Quiz]), QuestionsModule],
  exports: [QuizzesService],
})
export class QuizzesModule {}
