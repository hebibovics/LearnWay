package unsa.ba.etf.learnway.services.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import unsa.ba.etf.learnway.dtos.CommentResponseDTO;
import unsa.ba.etf.learnway.models.Comment;
import unsa.ba.etf.learnway.models.User;
import unsa.ba.etf.learnway.models.Course;
import unsa.ba.etf.learnway.repositories.CommentRepository;
import unsa.ba.etf.learnway.repository.CourseRepository;
import unsa.ba.etf.learnway.repository.UserRepository;
import unsa.ba.etf.learnway.services.CommentService;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    @Override
    public Comment saveComment(Comment comment) {
        return commentRepository.save(comment);
    }

    @Override
    public List<Comment> getCommentsByCourseId(Long courseId) {
        return commentRepository.findByCourse_CourseId(courseId);
    }

    @Override
    public Comment saveCommentForCourseAndUser(Comment comment, Long courseId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new EntityNotFoundException("Course not found with ID: " + courseId));

        comment.setUser(user);
        comment.setCourse(course);
        return commentRepository.save(comment);
    }
    @Override
    public List<CommentResponseDTO> getCommentDTOsByCourseId(Long courseId) {
        List<Comment> comments = commentRepository.findByCourse_CourseId(courseId);
        return comments.stream()
                .map(comment -> new CommentResponseDTO(
                        comment.getContent(),
                        comment.getUser().getUsername(),
                        comment.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
}
