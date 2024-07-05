package unsa.ba.etf.learnway.services;

import unsa.ba.etf.learnway.models.Question;
import unsa.ba.etf.learnway.models.Quiz;

import java.util.List;

public interface QuestionService {

    Question addQuestion(Question question);

    List<Question> getQuestions();

    Question getQuestion(Long quesId);

    Question updateQuestion(Question question);

    void deleteQuestion(Long questionId);

    //Extra Methods
    List<Question> getQuestionsByQuiz(Quiz quiz);

}
