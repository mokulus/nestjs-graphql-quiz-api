import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesResolver } from './quizzes.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { QuizInputValidationService } from './quiz.validation';
import { QuestionsModule } from 'src/questions/questions.module';

@Module({
  providers: [QuizzesResolver, QuizzesService, QuizInputValidationService],
  imports: [TypeOrmModule.forFeature([Quiz]), QuestionsModule],
})
export class QuizzesModule {}
