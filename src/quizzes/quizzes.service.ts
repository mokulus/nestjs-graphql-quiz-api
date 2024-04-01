import { Injectable } from '@nestjs/common';
import { CreateQuizInputDTO, QuizDTO, UpdateQuizInputDTO } from './dto/quiz';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import {
  Question,
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  SortingQuestion,
  TextQuestion,
} from './entities/question.entity';
import { SingleChoiceQuestionDTO } from './dto/question';
import { QuizInputValidationService } from './quizzes.validation';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(SingleChoiceQuestion)
    private singleChoiceQuestionRepository: Repository<SingleChoiceQuestion>,
    @InjectRepository(MultipleChoiceQuestion)
    private multipleChoiceQuestionRepository: Repository<MultipleChoiceQuestion>,
    @InjectRepository(SortingQuestion)
    private sortingQuestionRepository: Repository<SortingQuestion>,
    @InjectRepository(TextQuestion)
    private textQuestionRepository: Repository<TextQuestion>,
    private readonly createQuizInputValidation: QuizInputValidationService,
  ) {}

  async create(createQuizInput: CreateQuizInputDTO) {
    createQuizInput = this.createQuizInputValidation.validate(createQuizInput);
    const quiz = new Quiz();
    quiz.name = createQuizInput.name;
    quiz.questions = [];
    for (const question of createQuizInput.questions) {
      const questionBase = new Question();
      if (question.singleChoiceQuestionInput !== null) {
        const singleChoiceQuestionInput = question.singleChoiceQuestionInput;
        const singleChoiceQuestion = new SingleChoiceQuestion();
        singleChoiceQuestion.answers = singleChoiceQuestionInput.answers;
        singleChoiceQuestion.correctAnswer =
          singleChoiceQuestionInput.correctAnswer;
        questionBase.prompt = singleChoiceQuestionInput.prompt;
        questionBase.singleChoiceQuestion = singleChoiceQuestion;
      }
      quiz.questions.push(questionBase);
    }
    const result = await this.quizRepository.save(quiz);
    const quizDTO = new QuizDTO();
    quizDTO.id = result.id.toString();
    quizDTO.name = result.name;
    quizDTO.questions = result.questions.map((q) => {
      if (q.singleChoiceQuestion !== null) {
        const singleChoiceQuestionDTO = new SingleChoiceQuestionDTO();
        singleChoiceQuestionDTO.answers = q.singleChoiceQuestion.answers;
        singleChoiceQuestionDTO.correctAnswer =
          q.singleChoiceQuestion.correctAnswer;
        singleChoiceQuestionDTO.id = q.singleChoiceQuestion.id.toString();
        singleChoiceQuestionDTO.prompt = q.prompt;
        return singleChoiceQuestionDTO;
      }
    });
    return quizDTO;
  }

  findAll() {
    return `This action returns all quizzes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quiz`;
  }

  update(id: number, updateQuizInput: UpdateQuizInputDTO) {
    return `This action updates a #${id} quiz`;
  }

  remove(id: number) {
    return `This action removes a #${id} quiz`;
  }
}
