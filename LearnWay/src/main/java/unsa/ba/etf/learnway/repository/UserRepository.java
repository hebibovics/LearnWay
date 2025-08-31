package unsa.ba.etf.learnway.repository;

import unsa.ba.etf.learnway.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    List<User> findByRoleRoleNameAndUserId(String roleName, Long userId);

}
