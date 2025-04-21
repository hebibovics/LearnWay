package unsa.ba.etf.learnway.services.implementation;

import unsa.ba.etf.learnway.models.Course;
import unsa.ba.etf.learnway.models.Review;
import unsa.ba.etf.learnway.repository.CourseRepository;
import unsa.ba.etf.learnway.repository.ReviewRepository;
import unsa.ba.etf.learnway.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private CourseRepository courseRepository;


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
    public Review rateCourse(Review review) {
        if (review.getRate() < 1 || review.getRate() > 5) {
            throw new IllegalArgumentException("Ocjena mora biti između 1 i 5.");
        }

        Long courseId = review.getCourse().getCourseId();

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Kurs nije pronađen."));

        Review newReview = new Review();
        newReview.setCourse(course);
        newReview.setRate(review.getRate());
        newReview.setComment(""); // jer ne treba komentar

        return reviewRepository.save(newReview);
    }

}
