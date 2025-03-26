package unsa.ba.etf.learnway.services.implementation;

import unsa.ba.etf.learnway.models.Course;
import unsa.ba.etf.learnway.models.User;
import unsa.ba.etf.learnway.repository.CourseRepository;
import unsa.ba.etf.learnway.repository.UserRepository;
import unsa.ba.etf.learnway.services.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public Course addCourse(Course course) {
        return courseRepository.save(course);
    }

    @Override
    public List<Course> getCourses() {
        return courseRepository.findAll();
    }

    public Course getCourse(Long courseId) {
        return courseRepository.findById(courseId).isPresent() ? courseRepository.findById(courseId).get() : null;
    }

    @Override
    public Course updateCourse(Course course) {
        return courseRepository.save(course);
    }

    @Override
    public void deleteCourse(Long courseId) {
        courseRepository.delete(getCourse(courseId));
    }

    @Override
    public Course findCourseById(Long id) {
        Optional<Course> course = courseRepository.findById(id);
        if (course.isPresent()) {
            return course.get();
        } else {
            throw new RuntimeException("Course not found");
        }
    }
    public List<Course> getCoursesByInstructor(Long instructorId) {
        // Prvo provjeri da li instruktor postoji
        Optional<User> instructor = userRepository.findById(instructorId);
        if (instructor.isPresent() && instructor.get().getRoles().stream().anyMatch(role -> role.getRoleName().equals("INSTRUCTOR"))) {
            // Ako je instruktor pronađen, filtriraj kurseve prema ovom instruktoru
            return courseRepository.findByUsersRolesRoleNameAndUsersUserId("INSTRUCTOR", instructorId);
        } else {
            return Collections.emptyList(); // Nema kurseva za tog instruktora
        }
    }




    public Course addCourseForInstructor(Long instructorId, Course course) {
        // Dohvati profesora prema instructorId
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));

        // Dodaj profesora u kurs
        course.getUsers().add(instructor);

        // Spremi kurs i vrati
        return courseRepository.save(course);
    }
}
