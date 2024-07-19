package unsa.ba.etf.learnway.controllers;

import unsa.ba.etf.learnway.models.LoginRequest;
import unsa.ba.etf.learnway.models.LoginResponse;
import unsa.ba.etf.learnway.models.User;
import unsa.ba.etf.learnway.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    AuthService authService;


    @PostMapping("/register")
    public User registerUser(@RequestBody User user) throws Exception {
        return authService.registerUserService(user);
    }
//
//    {
//        "firstName":"sanis",
//            "lastName": "saaa",
//            "username": "sanidah1",
//            "password": "sani1",
//            "phoneNumber": "0001",
//            "isActive": true,
//            "user_role": "USER"
//    }
//
//



    @PostMapping("/login")
    public LoginResponse loginUser(@RequestBody LoginRequest loginRequest) throws Exception {
        return authService.loginUserService(loginRequest);
    }

}
