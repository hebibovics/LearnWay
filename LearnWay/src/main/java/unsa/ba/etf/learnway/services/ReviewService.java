package unsa.ba.etf.learnway.services;

import unsa.ba.etf.learnway.models.Review;

import java.util.List;
import java.util.Optional;

public interface ReviewService {

    Review addReview(Review review);

    List<Review> getReviews();

    Review getReview(Long reviewId);


    void deleteReview(Long reviewId);

    Review saveReview(Review review, Long courseId, Long userId);
    Review getReviewByUserAndCourse(Long userId, Long courseId);
    List<Review> getReviewsByCourseId(Long courseId);
}
