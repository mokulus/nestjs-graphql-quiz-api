CREATE TABLE quiz (
    quiz_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL
);
CREATE TABLE single_choice_question (
    single_choice_question_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    answers TEXT [] NOT NULL,
    correct_answer TEXT NOT NULL
);
CREATE TABLE multiple_choice_question (
    multiple_choice_question_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    answers TEXT [] NOT NULL,
    correct_answers TEXT [] NOT NULL
);
CREATE TABLE sorting_question (
    sorting_question_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    answers TEXT [] NOT NULL,
    correct_order TEXT [] NOT NULL
);
CREATE TABLE text_question (
    text_question_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    correct_answer TEXT NOT NULL
);
CREATE TABLE question (
    question_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    prompt TEXT NOT NULL,
    quiz_id INTEGER NOT NULL REFERENCES quiz (quiz_id) ON DELETE CASCADE,
    single_choice_question_id INTEGER REFERENCES single_choice_question (single_choice_question_id),
    multiple_choice_question_id INTEGER REFERENCES multiple_choice_question (multiple_choice_question_id),
    sorting_question_id INTEGER REFERENCES sorting_question (sorting_question_id),
    text_question_id INTEGER REFERENCES text_question (text_question_id)
);
ALTER TABLE question
ADD CONSTRAINT question_unique_fk UNIQUE (
        single_choice_question_id,
        multiple_choice_question_id,
        sorting_question_id,
        text_question_id
    );
