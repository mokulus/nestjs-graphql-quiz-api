import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesResolver } from './quizzes.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  providers: [QuizzesResolver, QuizzesService],
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/quizzes/quizzes.graphql.ts'),
        outputAs: 'class',
      },
    }),
  ],
})
export class QuizzesModule {}
