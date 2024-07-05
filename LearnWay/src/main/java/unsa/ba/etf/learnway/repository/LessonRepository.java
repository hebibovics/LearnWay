package unsa.ba.etf.learnway.repository;


import unsa.ba.etf.learnway.models.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
}
