package unsa.ba.etf.learnway.repository;


import unsa.ba.etf.learnway.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
