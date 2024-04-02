import { ResolveField, Resolver } from '@nestjs/graphql';

@Resolver('Question')
export class QuestionsResolver {
  @ResolveField()
  __resolveType(value) {
    return value.type;
  }
}
