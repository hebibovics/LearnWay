package unsa.ba.etf.learnway.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import unsa.ba.etf.learnway.models.Lesson;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
}
