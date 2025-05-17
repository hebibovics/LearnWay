package unsa.ba.etf.learnway.services.implementation;

import unsa.ba.etf.learnway.models.Course;
import unsa.ba.etf.learnway.models.Review;
import unsa.ba.etf.learnway.models.User;
import unsa.ba.etf.learnway.repository.CourseRepository;
import unsa.ba.etf.learnway.repository.ReviewRepository;
import unsa.ba.etf.learnway.repository.UserRepository;
import unsa.ba.etf.learnway.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;


    @Override
    public Review addReview(Review review) {
        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getReviews() {
        return reviewRepository.findAll();
    }

    public Review getReview(Long reviewId) {
        return reviewRepository.findById(reviewId).isPresent() ? reviewRepository.findById(reviewId).get() : null;
    }

    @Override
    public void deleteReview(Long reviewId) {
        reviewRepository.delete(getReview(reviewId));
    }

    @Override
    public Review saveReview(Review review, Long courseId, Long userId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new EntityNotFoundException("Course not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        review.setCourse(course);
        review.setUser(user);

        if (review.getRate() < 1 || review.getRate() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        return reviewRepository.save(review);
    }
    @Override
    public Review getReviewByUserAndCourse(Long userId, Long courseId) {
        return reviewRepository.findByUserUserIdAndCourseCourseId(userId, courseId).orElse(null);
    }
    @Override
    public List<Review> getReviewsByCourseId(Long courseId) {
        return reviewRepository.findByCourse_CourseId(courseId);
    }


}
