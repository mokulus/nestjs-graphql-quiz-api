import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsResolver } from './submissions.resolver';
import { QuizzesModule } from 'src/quizzes/quizzes.module';

@Module({
  providers: [SubmissionsService, SubmissionsResolver],
  imports: [QuizzesModule],
})
export class SubmissionsModule {}
