import { Injectable } from '@nestjs/common';
import { CreateQuizInputDTO, QuizDTO } from './dto/quiz';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { QuestionsService } from 'src/questions/questions.service';
import { QuestionConverterService } from 'src/questions/question.convert';
import { QuizInputValidationService } from './quiz.validation';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    private readonly quizInputValidationService: QuizInputValidationService,
    private readonly questionsService: QuestionsService,
    private readonly questionConverterService: QuestionConverterService,
  ) {}

  async create(createQuizInput: CreateQuizInputDTO) {
    createQuizInput = this.quizInputValidationService.validate(createQuizInput);
    const quiz = new Quiz();
    quiz.name = createQuizInput.name;
    quiz.questions = createQuizInput.questions.map((questionInput) =>
      this.questionsService.makeEntity(questionInput),
    );
    return this.quizRepository.save(quiz).then((quiz) => this.convert(quiz));
  }

  async findAll() {
    return this.quizRepository
      .find({
        relations: {
          questions: {
            singleChoiceQuestion: true,
            multipleChoiceQuestion: true,
            sortingQuestion: true,
            textQuestion: true,
          },
        },
      })
      .then((quizzes) => quizzes.map((quiz) => this.convert(quiz)));
  }

  private convert(quiz: Quiz): QuizDTO {
    const { id, name } = quiz;
    const quizDTO = Object.assign(new QuizDTO(), { id, name });
    if (quiz.questions != null) {
      quizDTO.questions = quiz.questions.map((question) => {
        const questionDTO = this.questionConverterService.visit(question);
        questionDTO.prompt = question.prompt;
        questionDTO.id = question.id.toString();
        return questionDTO;
      });
    }
    return quizDTO;
  }
}
