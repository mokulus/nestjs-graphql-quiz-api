import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { Quiz } from '../src/quizzes/entities/quiz.entity';
import { QuizDTO } from '../src/quizzes/dto/quiz';
import {
  MultipleChoiceQuestionDTO,
  SingleChoiceQuestionDTO,
  SortingQuestionDTO,
  TextQuestionDTO,
} from '../src/questions/dto/question';

describe('QuizApi (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    const dataSource = app.get(DataSource);
    await dataSource.createQueryBuilder().delete().from(Quiz).execute();
    await app.close();
  });

  describe('create', () => {
    it('returns correct data', () => {
      const query =
        'mutation {\n' +
        '  createQuiz(\n' +
        '    createQuizInput: {\n' +
        '      name: "My awesome quiz"\n' +
        '      questions: [\n' +
        '        {\n' +
        '          singleChoiceQuestionInput: {\n' +
        '            prompt: "What is the capital of France?"\n' +
        '            answers: ["London", "Paris", "Berlin", "Madrid"]\n' +
        '            correctAnswer: "Paris"\n' +
        '          }\n' +
        '        }\n' +
        '        {\n' +
        '          multipleChoiceQuestionInput: {\n' +
        '            prompt: "Which countries are in Europe?"\n' +
        '            answers: ["Monaco", "Morocco", "Poland", "Algeria"]\n' +
        '            correctAnswers: ["Poland", "Monaco"]\n' +
        '          }\n' +
        '        }\n' +
        '        {\n' +
        '          sortingQuestionInput: {\n' +
        '            prompt: "Sort the letters"\n' +
        '            answers: ["B", "C", "A"]\n' +
        '            correctOrder: ["A", "B", "C"]\n' +
        '          }\n' +
        '        }\n' +
        '        {\n' +
        '          textQuestionInput: {\n' +
        '            prompt: "What is the famous phrase from Star Wars? "\n' +
        '            correctAnswer: "May the force be with you!"\n' +
        '          }\n' +
        '        }\n' +
        '      ]\n' +
        '    }\n' +
        '  ) {\n' +
        '    id\n' +
        '    name\n' +
        '    questions {\n' +
        '      id\n' +
        '      prompt\n' +
        '      ... on SingleChoiceQuestion {\n' +
        '        answers\n' +
        '        correctAnswer\n' +
        '      }\n' +
        '      ... on MultipleChoiceQuestion {\n' +
        '        answers\n' +
        '        correctAnswers\n' +
        '      }\n' +
        '      ... on SortingQuestion {\n' +
        '        answers\n' +
        '        correctOrder\n' +
        '      }\n' +
        '      ... on TextQuestion {\n' +
        '        correctAnswer\n' +
        '      }\n' +
        '    }\n' +
        '  }\n' +
        '}';
      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: query })
        .expect(({ body }) => {
          const quiz = body.data.createQuiz as QuizDTO;
          expect(quiz.name).toEqual('My awesome quiz');

          const single = quiz.questions[0] as SingleChoiceQuestionDTO;
          expect(single.prompt).toEqual('What is the capital of France?');
          expect(single.correctAnswer).toEqual('Paris');
          expect(single.answers).toEqual([
            'London',
            'Paris',
            'Berlin',
            'Madrid',
          ]);

          const multiple = quiz.questions[1] as MultipleChoiceQuestionDTO;
          expect(multiple.prompt).toEqual('Which countries are in Europe?');
          expect(multiple.answers).toEqual([
            'Monaco',
            'Morocco',
            'Poland',
            'Algeria',
          ]);
          expect(multiple.correctAnswers).toEqual(['Poland', 'Monaco']);

          const sorting = quiz.questions[2] as SortingQuestionDTO;
          expect(sorting.prompt).toEqual('Sort the letters');
          expect(sorting.answers).toEqual(['B', 'C', 'A']);
          expect(sorting.correctOrder).toEqual(['A', 'B', 'C']);

          const text = quiz.questions[3] as TextQuestionDTO;
          expect(text.prompt).toEqual(
            'What is the famous phrase from Star Wars? ',
          );
          expect(text.correctAnswer).toEqual('May the force be with you!');
        });
    });
  });
});
