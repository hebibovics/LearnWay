package unsa.ba.etf.learnway.services.implementation;

import unsa.ba.etf.learnway.models.Review;
import unsa.ba.etf.learnway.repository.ReviewRepository;
import unsa.ba.etf.learnway.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

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
}
