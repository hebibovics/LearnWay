package unsa.ba.etf.learnway;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import unsa.ba.etf.learnway.repository.RoleRepository;
import unsa.ba.etf.learnway.models.Role;

import java.util.Arrays;

@SpringBootApplication
public class LearnWayApplication {

    public static void main(String[] args) {
        SpringApplication.run(LearnWayApplication.class, args);
    }

    @Bean
    public ApplicationRunner initializer(RoleRepository roleRepository) {
        return args -> roleRepository.saveAll(Arrays.asList(
                Role.builder().roleName("USER").roleDescription("Default Role provided to each user").build(),
                Role.builder().roleName("ADMIN").roleDescription("Superuser, who has access for all functionality").build(),
                Role.builder().roleName("INSTRUCTOR").roleDescription("User, who creates courses, adds lessons and tracks students progress").build()));
    }

}
