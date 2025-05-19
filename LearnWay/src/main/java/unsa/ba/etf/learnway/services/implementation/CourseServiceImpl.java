package unsa.ba.etf.learnway.services.implementation;

import unsa.ba.etf.learnway.dtos.StudentDTO;
import unsa.ba.etf.learnway.models.Course;
import unsa.ba.etf.learnway.models.User;
import unsa.ba.etf.learnway.repository.CourseRepository;
import unsa.ba.etf.learnway.repository.UserRepository;
import unsa.ba.etf.learnway.services.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

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
        Optional<User> instructor = userRepository.findById(instructorId);
        if (instructor.isPresent() && instructor.get().getRoles().stream().anyMatch(role -> role.getRoleName().equals("INSTRUCTOR"))) {
            return courseRepository.findByInstructorId(instructorId);
        } else {
            return Collections.emptyList();
        }
    }





    public Course addCourseForInstructor(Long instructorId, Course course) {
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));

        boolean isInstructor = instructor.getRoles().stream()
                .anyMatch(role -> role.getRoleName().equalsIgnoreCase("INSTRUCTOR"));
        if (!isInstructor) {
            throw new RuntimeException("User is not an instructor");
        }

        course.setInstructor(instructor);
        return courseRepository.save(course);
    }

    @Override
    public Course enrollUserToCourse(Long courseId, Long userId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Provjera da li user ima rolu USER
        boolean isStudent = user.getRoles().stream()
                .anyMatch(role -> role.getRoleName().equalsIgnoreCase("USER"));
        if (!isStudent) {
            throw new RuntimeException("Only users with role USER can enroll");
        }

        // Enroll user if not already enrolled
        if (!user.getCourses().contains(course)) {
            user.getCourses().add(course);
            // Opcionalno za dvosmjernu sinhronizaciju
            course.getUsers().add(user);
        }

        // Bitno: spremi user-a jer on upravlja relacijom!
        userRepository.save(user);

        return course;
    }

    @Override
    public List<Course> getCoursesByStudentId(Long studentId) {
        return courseRepository.findCoursesByUserId(studentId);
    }

    @Override
    public Set<StudentDTO> getStudentsDTOByCourseId(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));

        Set<StudentDTO> dtos = new HashSet<>();
        for (User user : course.getUsers()) {
            dtos.add(new StudentDTO(
                    user.getUserId(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getUsername(),
                    user.getPhoneNumber()
            ));
        }
        return dtos;
    }



}
