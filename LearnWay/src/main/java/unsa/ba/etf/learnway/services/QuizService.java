package unsa.ba.etf.learnway.services;

import unsa.ba.etf.learnway.models.Category;
import unsa.ba.etf.learnway.models.Quiz;

import java.util.List;


public interface QuizService {

    Quiz addQuiz(Quiz quiz);

    List<Quiz> getQuizzes();

    Quiz getQuiz(Long quizId);

    Quiz updateQuiz(Quiz quiz);

    void deleteQuiz(Long quizId);

    List<Quiz> getQuizzesByCourse(Long courseId);


}
