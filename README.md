# Quiz API by Mateusz Okulus

# Running

Copy `.env.example` to `.env`

```shell
cp .env.example .env
```

Start the database
```shell
docker compose up --build --detach
```
Database will be initialized with the schema contained in database folder.

If you want to reset the database
```shell
docker compose down
docker volume rm quiz-api_postgres-data
docker compose up --build --detach
```

Install packages and start server.

```shell
# install packages
npm install
# run tests
npm run test
# start dev server
npm run start:dev
```

You can now go to http://localhost:3000/graphql to visit GraphQL playground.

# GraphQL queries and mutations

## Create a quiz
```graphql
mutation {
  createQuiz(
    createQuizInput: {
      name: "My awesome quiz"
      questions: [
        {
          singleChoiceQuestionInput: {
            prompt: "What is the capital of France?"
            answers: ["London", "Paris", "Berlin", "Madrid"]
            correctAnswer: "Paris"
          }
        }
        {
          multipleChoiceQuestionInput: {
            prompt: "Which countries are in Europe?"
            answers: ["Monaco", "Morocco", "Poland", "Algeria"]
            correctAnswers: ["Poland", "Monaco"]
          }
        }
        {
          sortingQuestionInput: {
            prompt: "Sort the letters"
            answers: ["B", "C", "A"]
            correctOrder: ["A", "B", "C"]
          }
        }
        {
          textQuestionInput: {
            prompt: "What is the famous phrase from Star Wars? "
            correctAnswer: "May the force be with you!"
          }
        }
      ]
    }
  ) {
    id
    name
    questions {
      id
      prompt
      ... on SingleChoiceQuestion {
        answers
        correctAnswer
      }
      ... on MultipleChoiceQuestion {
        answers
        correctAnswers
      }
      ... on SortingQuestion {
        answers
        correctOrder
      }
      ... on TextQuestion {
        correctAnswer
      }
    }
  }
}
```

## Fetch all quizzes
```graphql
query {
  quizzes {
    id
    name
    questions {
      id
      prompt
      ... on SingleChoiceQuestion {
        answers
        correctAnswer
      }
      ... on MultipleChoiceQuestion {
        answers
        correctAnswers
      }
      ... on SortingQuestion {
        answers
        correctOrder
      }
      ... on TextQuestion {
        correctAnswer
      }
    }
  }
}
```

## Fetch a single quiz
```graphql
query {
  quiz(id: 1) {
    id  
    name
    questions {
      prompt
      ... on SingleChoiceQuestion {
        answers
        correctAnswer
      }
      ... on MultipleChoiceQuestion {
        answers
        correctAnswers
      }
      ... on SortingQuestion {
        answers
        correctOrder
      }
      ... on TextQuestion {
        correctAnswer
      }
    }
  }
}
```

## Score a quiz
```graphql
query {
  scoreQuizSubmission(
    quizSubmissionInput: {
      quizID: "1"
      submissions: [
        {
          questionID: 1
          singleChoiceQuestionSubmissionInput: { answer: "Paris" }
        }
        {
          questionID: 2
          multipleChoiceQuestionSubmissionInput: {
            answers: ["Monaco", "Poland"]
          }
        }
        {
          questionID: 3
          sortingQuestionSubmissionInput: { answers: ["A", "B", "C"] }
        }
        {
          questionID: 4
          textQuestionSubmissionInput: { answer: "may the force be with you" }
        }
      ]
    }
  ) {
    totalObtained
    totalMaximum
    scores {
      questionID
      obtained
      maximum
    }
  }
}
```

## Update a quiz

### Updating just name
```graphql
mutation {
  updateQuiz(updateQuizInput: { id: 1, name: "New name for the quiz" }) {
    id
    name
    questions {
      id
      prompt
      ... on SingleChoiceQuestion {
        answers
        correctAnswer
      }
      ... on MultipleChoiceQuestion {
        answers
        correctAnswers
      }
      ... on SortingQuestion {
        answers
        correctOrder
      }
      ... on TextQuestion {
        correctAnswer
      }
    }
  }
}

```

### Updating just questions
```graphql
mutation {
  updateQuiz(
    updateQuizInput: {
      id: 1
      questions: [
        {
          singleChoiceQuestionInput: {
            prompt: "Is this the only question?"
            answers: ["Yes", "No"]
            correctAnswer: "Yes"
          }
        }
      ]
    }
  ) {
    id
    name
    questions {
      id
      prompt

      ... on SingleChoiceQuestion {
        answers
        correctAnswer
      }
      ... on MultipleChoiceQuestion {
        answers
        correctAnswers
      }
      ... on SortingQuestion {
        answers
        correctOrder
      }
      ... on TextQuestion {
        correctAnswer
      }
    }
  }
}
```


## Remove a quiz
```graphql
mutation {
  removeQuiz(id: 1) {
    id
    name
    questions {
      id
      prompt
      ... on SingleChoiceQuestion {
        answers
        correctAnswer
      }
      ... on MultipleChoiceQuestion {
        answers
        correctAnswers
      }
      ... on SortingQuestion {
        answers
        correctOrder
      }
      ... on TextQuestion {
        correctAnswer
      }
    }
  }
}
```

## Further work

- More efficient SQL queries.

    Ideally SQL queries should only request what the GraphQL query requested.
    Field for `SELECT` should be dynamically generated, same for `JOIN`s.
    For example, when the question prompt is not specified in GraphQL query,
    it shouldn't be requested in SQL query as well.
    Right now there is only basic handling of this in `findAll` and `findById`,
    which avoids the `JOIN`s when questions are not requested.
    At the same time there should only be one round trip to the database,
    so things like `@ResolveField` don't seem appropriate.

    I couldn't find a good, established way of doing it with Nest.js.
    It seems most people parse the GraphQL query and roll their own solution.