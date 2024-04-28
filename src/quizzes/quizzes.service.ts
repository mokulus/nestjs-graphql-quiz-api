import { Injectable } from '@nestjs/common';
import { CreateQuizInputDTO, QuizDTO, UpdateQuizInputDTO } from './dto/quiz';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { QuestionsService } from '../questions/questions.service';
import { QuestionConverterService } from '../questions/question.convert';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    private readonly questionsService: QuestionsService,
    private readonly questionConverterService: QuestionConverterService,
  ) {}

  async create(createQuizInput: CreateQuizInputDTO): Promise<QuizDTO> {
    const quiz = new Quiz();
    quiz.name = createQuizInput.name;
    quiz.questions = createQuizInput.questions.map((questionInput) =>
      this.questionsService.makeEntity(questionInput),
    );
    return this.convert(await this.quizRepository.save(quiz));
  }

  async update(updateQuizInput: UpdateQuizInputDTO): Promise<QuizDTO | null> {
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
    return this.convert(await this.quizRepository.save(quiz));
  }

  async remove(id: number): Promise<QuizDTO | null> {
    const quiz = await this.quizRepository.findOne({
      where: { id: +id },
      relations: this.relations(),
    });
    if (quiz == null) return null;
    const removed = await this.quizRepository.remove(quiz);
    removed.id = id;
    return this.convert(removed);
  }

  async findAll(fetchQuestions: boolean): Promise<QuizDTO[]> {
    const quizzes = await this.quizRepository.find({
      relations: fetchQuestions ? this.relations() : {},
      order: {
        questions: {
          id: 'ASC',
        },
      },
    });
    return quizzes.map(this.convert.bind(this));
  }

  async findById(id: number, fetchQuizzes: boolean): Promise<QuizDTO | null> {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: fetchQuizzes ? this.relations() : {},
    });
    return quiz == null ? null : this.convert(quiz);
  }

  private convert(quiz: Quiz): QuizDTO {
    const { id, name } = quiz;
    const quizDTO = Object.assign(new QuizDTO(), { id, name });
    if (quiz.questions != null) {
      quizDTO.questions = quiz.questions.map((question) => {
        const questionDTO = this.questionConverterService.convert(question);
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
