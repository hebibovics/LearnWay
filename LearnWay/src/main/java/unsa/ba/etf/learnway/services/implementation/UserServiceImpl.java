package unsa.ba.etf.learnway.services.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import unsa.ba.etf.learnway.models.User;
import unsa.ba.etf.learnway.repository.UserRepository;
import unsa.ba.etf.learnway.services.UserService;

import javax.transaction.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public boolean deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(null);

        userRepository.delete(user);

        return true;
    }
}
