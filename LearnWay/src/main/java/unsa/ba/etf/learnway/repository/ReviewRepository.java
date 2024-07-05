package unsa.ba.etf.learnway.repository;


import unsa.ba.etf.learnway.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
