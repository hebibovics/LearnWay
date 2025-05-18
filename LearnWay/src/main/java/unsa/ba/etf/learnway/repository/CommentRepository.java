package unsa.ba.etf.learnway.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import unsa.ba.etf.learnway.models.Comment;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByCourse_CourseId(Long courseId);
    @Query("SELECT c FROM Comment c JOIN FETCH c.user WHERE c.course.courseId = :courseId ORDER BY c.createdAt DESC")
    List<Comment> findAllByCourseIdWithUser(@Param("courseId") Long courseId);
}
