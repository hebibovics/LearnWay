package unsa.ba.etf.learnway.repository;


import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import unsa.ba.etf.learnway.models.Category;
import unsa.ba.etf.learnway.models.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Course findByTitle(String title);
    List<Course> findByUsersRolesRoleNameAndUsersUserId(String roleName, Long userId);
    @Query("SELECT c FROM Course c WHERE c.instructor.userId = :instructorId")
    List<Course> findByInstructorId(@Param("instructorId") Long instructorId);

    @Query("SELECT c FROM Course c JOIN c.users u WHERE u.userId = :userId")
    List<Course> findCoursesByUserId(@Param("userId") Long userId);


}
