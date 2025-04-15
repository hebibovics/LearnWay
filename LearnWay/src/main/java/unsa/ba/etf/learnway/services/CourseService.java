package unsa.ba.etf.learnway.services;

import unsa.ba.etf.learnway.models.Course;

import java.util.List;

public interface CourseService {

    Course addCourse(Course course);

    List<Course> getCourses();

    Course getCourse(Long courseId);

    Course updateCourse(Course course);
    Course findCourseById(Long id);

    void deleteCourse(Long courseId);
    List<Course> getCoursesByInstructor(Long instructorId);
    Course addCourseForInstructor(Long instructorId, Course course);
    Course enrollUserToCourse(Long courseId, Long userId);

}
