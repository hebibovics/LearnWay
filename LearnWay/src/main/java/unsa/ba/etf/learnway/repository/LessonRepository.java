package unsa.ba.etf.learnway.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import unsa.ba.etf.learnway.models.Course;
import unsa.ba.etf.learnway.models.Lesson;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
    public List<Lesson> findByCourse(Course course);

}
