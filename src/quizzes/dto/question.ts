import { Question, SingleChoiceQuestion } from '../../graphql';

export interface QuestionDTO extends Question {}
export class SingleChoiceQuestionDTO
  extends SingleChoiceQuestion
  implements QuestionDTO
{
  type = 'SingleChoiceQuestion';
}
