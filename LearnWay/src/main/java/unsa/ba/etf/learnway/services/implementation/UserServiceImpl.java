package unsa.ba.etf.learnway.services.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import unsa.ba.etf.learnway.models.Course;
import unsa.ba.etf.learnway.models.User;
import unsa.ba.etf.learnway.repository.UserRepository;
import unsa.ba.etf.learnway.services.UserService;
import unsa.ba.etf.learnway.repository.CourseRepository;

import javax.transaction.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;


    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public boolean deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));



        // unenroll iz svih kurseva
        for (Course course : user.getCourses()) {
            course.getUsers().remove(user);
        }
        user.getCourses().clear();

        // ako je instruktor, prvo mu delete kurseve
        if ("INSTRUCTOR".equalsIgnoreCase(user.getRole().getRoleName())) {
            List<Course> instructorCourses = courseRepository.findByInstructorId(userId);
            for (Course course : instructorCourses) {
                courseRepository.delete(course);
            }

        }

        userRepository.delete(user);
        return true;
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
