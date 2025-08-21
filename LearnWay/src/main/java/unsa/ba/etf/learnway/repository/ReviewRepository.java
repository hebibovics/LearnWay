package unsa.ba.etf.learnway.repository;


import unsa.ba.etf.learnway.models.Course;
import unsa.ba.etf.learnway.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import unsa.ba.etf.learnway.models.User;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Optional<Review> findByUserUserIdAndCourseCourseId(Long userId, Long courseId);

    List<Review> findByCourse_CourseId(Long courseId);

}
