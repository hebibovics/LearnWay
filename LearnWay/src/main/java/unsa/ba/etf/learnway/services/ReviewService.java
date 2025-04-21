package unsa.ba.etf.learnway.services;

import unsa.ba.etf.learnway.models.Review;

import java.util.List;

public interface ReviewService {

    Review addReview(Review review);

    List<Review> getReviews();

    Review getReview(Long reviewId);


    void deleteReview(Long reviewId);

    Review rateCourse(Review review);

}
