import { ResolveField, Resolver } from '@nestjs/graphql';

@Resolver('Question')
export class QuestionsResolver {
  @ResolveField()
  __resolveType(value: { type: unknown }) {
    return value.type;
  }
}
