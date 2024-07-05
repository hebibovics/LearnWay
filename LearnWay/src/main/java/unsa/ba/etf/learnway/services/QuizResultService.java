package unsa.ba.etf.learnway.services;

import unsa.ba.etf.learnway.models.QuizResult;

import java.util.List;

public interface QuizResultService {
    QuizResult addQuizResult(QuizResult quizResult);
    List<QuizResult> getQuizResults();

    List<QuizResult> getQuizResultsByUser(Long userId);
}

