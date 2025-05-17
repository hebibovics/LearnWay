package unsa.ba.etf.learnway.controllers;

import unsa.ba.etf.learnway.models.Review;
import unsa.ba.etf.learnway.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/review")

public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/")
    public ResponseEntity<?> addReview(@RequestBody Review review) {
        return ResponseEntity.ok(reviewService.addReview(review));
    }

    @GetMapping("/")
    public ResponseEntity<?> getReviews() {
        return ResponseEntity.ok(reviewService.getReviews());
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<?> getReview(@PathVariable Long reviewId) {
        return ResponseEntity.ok(reviewService.getReview(reviewId));
    }


    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok(true);
    }

    @PostMapping("/add")
    public ResponseEntity<Review> addReview(
            @RequestParam Long courseId,
            @RequestParam Long userId,
            @RequestBody Review review) {

        Review savedReview = reviewService.saveReview(review, courseId, userId);
        return ResponseEntity.ok(savedReview);
    }


    @GetMapping("/user/{userId}/course/{courseId}")
    public ResponseEntity<?> getReviewByUserAndCourse(@PathVariable Long userId, @PathVariable Long courseId) {
        Review review = reviewService.getReviewByUserAndCourse(userId, courseId);
        if (review != null) {
            return ResponseEntity.ok(review);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Review not found for given user and course.");
        }
    }
    @GetMapping("/course/{courseId}")
    public List<Review> getReviewsByCourseId(@PathVariable Long courseId) {
        return reviewService.getReviewsByCourseId(courseId);
    }
}
