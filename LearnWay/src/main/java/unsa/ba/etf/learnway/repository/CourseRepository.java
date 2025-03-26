package unsa.ba.etf.learnway.repository;


import unsa.ba.etf.learnway.models.Category;
import unsa.ba.etf.learnway.models.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Course findByTitle(String title);
    List<Course> findByUsersRolesRoleNameAndUsersUserId(String roleName, Long userId);

}
