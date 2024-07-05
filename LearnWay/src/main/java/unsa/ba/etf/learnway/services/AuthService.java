package unsa.ba.etf.learnway.services;

import unsa.ba.etf.learnway.models.LoginRequest;
import unsa.ba.etf.learnway.models.LoginResponse;
import unsa.ba.etf.learnway.models.User;

public interface AuthService {
    User registerUserService(User user) throws Exception;

    LoginResponse loginUserService(LoginRequest loginRequest) throws Exception;
}
