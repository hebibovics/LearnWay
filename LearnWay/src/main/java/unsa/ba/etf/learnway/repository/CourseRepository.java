package unsa.ba.etf.learnway.repository;


import unsa.ba.etf.learnway.models.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
}
