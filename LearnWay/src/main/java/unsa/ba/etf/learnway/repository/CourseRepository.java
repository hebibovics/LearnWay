package unsa.ba.etf.learnway.repository;


import unsa.ba.etf.learnway.models.Category;
import unsa.ba.etf.learnway.models.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Course findByTitle(String title);
}
