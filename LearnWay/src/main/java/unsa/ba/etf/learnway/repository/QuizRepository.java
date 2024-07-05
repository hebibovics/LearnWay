package unsa.ba.etf.learnway.repository;

import unsa.ba.etf.learnway.models.Category;
import unsa.ba.etf.learnway.models.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByCategory(Category category);
}
