package unsa.ba.etf.learnway.repository;

import unsa.ba.etf.learnway.models.Question;
import unsa.ba.etf.learnway.models.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByQuiz(Quiz quiz);
}
