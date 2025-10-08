package unsa.ba.etf.learnway.services.implementation;

import unsa.ba.etf.learnway.configurations.JwtUtil;
import unsa.ba.etf.learnway.models.LoginRequest;
import unsa.ba.etf.learnway.models.LoginResponse;
import unsa.ba.etf.learnway.models.Role;
import unsa.ba.etf.learnway.models.User;
import unsa.ba.etf.learnway.repository.RoleRepository;
import unsa.ba.etf.learnway.repository.UserRepository;
import unsa.ba.etf.learnway.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public User registerUserService(User user) throws Exception {
        User temp = userRepository.findByUsername(user.getUsername());
        if (temp != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User Already Exists");
        }

        // Ako korisnik posalje rolu koristi tu, inace default
        String roleName = (user.getRole() != null)
                ? user.getRole().getRoleName()
                : "INSTRUCTOR";

        Role role = roleRepository.findById(roleName)
                .orElseThrow(() -> new Exception("Role not found"));

        user.setRole(role);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);
        userRepository.flush();

        return savedUser;

    }

    public LoginResponse loginUserService(LoginRequest loginRequest) throws Exception {
        authenticate(loginRequest.getUsername(), loginRequest.getPassword());

        UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(loginRequest.getUsername());
        String token = jwtUtil.generateToken(userDetails);

        return new LoginResponse(userRepository.findByUsername(loginRequest.getUsername()), token);
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }
}
