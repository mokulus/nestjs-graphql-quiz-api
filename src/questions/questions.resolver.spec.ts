import { QuestionsResolver } from './questions.resolver';
import { Test } from '@nestjs/testing';

describe('QuestionsResolver', () => {
  let questionsResolver: QuestionsResolver;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [QuestionsResolver],
    }).compile();
    questionsResolver = module.get(QuestionsResolver);
  });

  it('should be defined', () => {
    expect(questionsResolver).toBeDefined();
  });

  it('should have __resolveType', () => {
    const result = questionsResolver.__resolveType({ type: 'type marker' });
    expect(result).toEqual('type marker');
    expect(questionsResolver.__resolveType).toBeDefined();
  });
});
