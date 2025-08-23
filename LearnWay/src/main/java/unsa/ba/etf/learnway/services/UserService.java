package unsa.ba.etf.learnway.services;

import unsa.ba.etf.learnway.models.User;

import java.util.List;

public interface UserService {
    List<User> getAllUsers();
    boolean deleteUser(Long id);
}
