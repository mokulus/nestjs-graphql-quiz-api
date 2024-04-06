import { Injectable } from '@nestjs/common';
import { CreateQuizInputDTO, QuizDTO, UpdateQuizInputDTO } from './dto/quiz';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { QuestionsService } from 'src/questions/questions.service';
import { QuestionConverterService } from 'src/questions/question.convert';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    private readonly questionsService: QuestionsService,
    private readonly questionConverterService: QuestionConverterService,
  ) {}

  async create(createQuizInput: CreateQuizInputDTO) {
    const quiz = new Quiz();
    quiz.name = createQuizInput.name;
    quiz.questions = createQuizInput.questions.map((questionInput) =>
      this.questionsService.makeEntity(questionInput),
    );
    return this.quizRepository.save(quiz).then((quiz) => this.convert(quiz));
  }

  async update(updateQuizInput: UpdateQuizInputDTO) {
    const { id, name, questions } = updateQuizInput;
    const quiz = await this.quizRepository.findOne({
      where: { id: +id },
      relations: this.relations(),
    });
    if (quiz == null) return null;
    if (name != null) quiz.name = name;
    if (questions != null)
      quiz.questions = questions.map((questionInput) =>
        this.questionsService.makeEntity(questionInput),
      );
    return await this.quizRepository
      .save(quiz)
      .then((quiz) => this.convert(quiz));
  }

  async remove(id: number) {
    const quiz = await this.quizRepository.findOne({
      where: { id: +id },
      relations: this.relations(),
    });
    if (quiz == null) return null;
    return this.convert(await this.quizRepository.remove(quiz));
  }

  async findAll() {
    return this.quizRepository
      .find({
        relations: this.relations(),
        order: {
          questions: {
            id: 'ASC',
          },
        },
      })
      .then((quizzes) => quizzes.map((quiz) => this.convert(quiz)));
  }

  findById(id: number) {
    return this.quizRepository
      .findOne({
        where: { id },
        relations: this.relations(),
      })
      .then((quiz) => (quiz == null ? quiz : this.convert(quiz)));
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

  private relations() {
    return {
      questions: {
        singleChoiceQuestion: true,
        multipleChoiceQuestion: true,
        sortingQuestion: true,
        textQuestion: true,
      },
    };
  }
}
